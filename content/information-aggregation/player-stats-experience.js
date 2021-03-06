/**
 * player-stats-experience.js
 * show how much experience a player gained in individual matches
 * and shows current subskill
 * this currently works on the assumption that 28.571 pts
 * are the fixed margin for a skillup,
 * even if that might not be 100% true for all levels
 * @author CatzHoek, LA-MJ
 */

'use strict';

/* eslint-disable no-magic-numbers */

Foxtrick.modules['PlayerStatsExperience'] = {
	MODULE_CATEGORY: Foxtrick.moduleCategories.INFORMATION_AGGREGATION,
	PAGES: ['playerStats', 'playerDetails'],
	OPTIONS: ['AlwaysShowAll'],
	CSS: Foxtrick.InternalPath + 'resources/css/player-stats.css',
	XP_PTS_PER_LEVEL: 200.0 / 7, // =28.571; see 15766691.780
	XP_CELL_IDX: 7, // current xp is the <integer>-th column in the table
	store: {},
	run: function(doc) {
		var module = this;

		// don't randomly rename, parts of this are taken from hattrick using image classnames
		var XP = {
			// assume international friendly as default, considered in min-max,
			// minimum uses 1/2 of this value
			matchFriendly: 0.2,
			matchLeague: 1.0,
			matchCupA: 2.0,
			matchCupB1: 0.5,
			matchCupB2: 0.5,
			matchCupB3: 0.5,
			matchCupC: 0.5,
			matchQualification: 2.0,
			matchMasters: 5.0,

			// NT
			// fakenames: we generate these types
			matchNtFriendly: 2.0, // (iconsytle + gametype)
			matchNtLeague: 10.0, // (iconsytle + gametype + match date)
			matchNtFinals: 20.0, // (iconsytle + gametype + match date)
		};

		// setup the 'database'

		this.matchTypes = [];
		for (var matchType in XP)
			this.matchTypes.push(matchType);

		var matches = this.store.matches = {};
		Foxtrick.forEach(function(type) {
			matches[type] = {
				minutes: { min: 0, max: 0 },
				count: { min: 0.0, max: 0.0 },
				xp: { min: 0.0, max: 0.0 },
			};
		}, this.matchTypes);
		this.store.xp = { points: { min: 0.0, max: 0.0 }, xp: { min: 0.0, max: 0.0 }};
		this.store.currentSkill = null;
		this.store.skillup = false;

		// define algorithm

		var runStatsTables = function(statsTable) {

			// START ROW UTILS

			// figure out if a match is a NT match, quite fragile i guess,
			// only NT matches have styles atm
			var isNTMatch = function(node) {
				var gametypeParent = node.querySelector('td.keyColumn');
				var gameTypeImage = gametypeParent.querySelector('.iconMatchtype img');
				return gameTypeImage.parentNode.getAttribute('style') !== null;
			};

			// new W.O detection
			var isWalkover = function(node) {
				var starCell = node.querySelector('td:last-child');
				var starImg = starCell.querySelector('img[class^="star"]');
				var stars = starCell.textContent.trim();

				// stars in standard || no perform || stars in simple
				if (stars.length === 0 || !!starImg || stars.match(/^[0-9,.\s()]+$/))
					return false;

				return true;
			};

			// get minutes played, maximum 90 minutes though
			var getPlayedMinutes = function(node) {
				// sum up the diff positions
				var playtimes = node.querySelector('td.endColumn1');
				var intRE = /\d+/g;
				var playMinutes = playtimes.textContent.match(intRE);
				var minutes = 0;
				if (playMinutes !== null) {
					for (var i = 0; i < playMinutes.length; i++) {
						if (!isNaN(playMinutes[i]))
							minutes += parseInt(playMinutes[i], 10);
					}
				}

				// max 90'
				return Math.min(90, minutes);
			};

			// figure out the gametype, most important to figure out how many xp pts are gained
			var getGameType = function(node, date, u20) {
				// most games can be identified by the classname directly, NT needs some tricks
				var getBasicGameType = function(node) {
					var gametypeParent = node.querySelector('td.keyColumn');
					var gameTypeImage = gametypeParent.querySelector('.iconMatchtype img');
					return gameTypeImage.className;
				};

				var gameType = getBasicGameType(node);
				var isNT = isNTMatch(node);
				if (!isNT)
					return gameType;

				if (gameType == 'matchFriendly')
					return 'matchNtFriendly';

				if (gameType == 'matchLeague') {
					let htDate = Foxtrick.util.time.gregorianToHT(date);

					// oldies wc finals are in odd seasons, u20 in even seasons
					// eslint-disable-next-line no-bitwise
					let isWcFinalSeason = htDate.season % 2 ^ u20;
					if (!isWcFinalSeason)
						return 'matchNtLeague';

					let semifinal = date.getDay() == 5;
					let final = date.getDay() === 0;
					if (htDate.week == 16 && (semifinal || final))
						return 'matchNtFinals';

					return 'matchNtLeague';
				}

				return null;
			};

			// get xp gain by gametype, see above
			var getXpGain = function(minutes, gametype) {
				return XP[gametype] / 90.0 * minutes;
			};

			// adjust min and max values to take care of international vs. national friendlies
			var getXPMinMaxDifference = function(ntMatch, xpGain, gameType) {
				var dxp = { min: xpGain, max: xpGain };
				if (!ntMatch && gameType == 'matchFriendly')
					dxp.min /= 2;

				return dxp;
			};

			// END ROW UTILS

			// var offset = 'module.HTDateFormat.FirstDayOfWeekOffset_text';
			// var weekOffset = Foxtrick.Prefs.getString(offset);

			var WO_TITLE = Foxtrick.L10n.getString('PlayerStatsExperience.Walkover');
			var statsRows = statsTable.rows;

			// header
			// add XP column
			var thXP = doc.createElement('th');
			Foxtrick.makeFeaturedElement(thXP, module);
			Foxtrick.addClass(thXP, 'stats');
			thXP.textContent =
				Foxtrick.L10n.getString('PlayerStatsExperience.ExperienceChange.title.abbr');
			thXP.title = Foxtrick.L10n.getString('PlayerStatsExperience.ExperienceChange.title');
			statsRows[0].insertBefore(thXP, statsRows[0].cells[8]);

			var store = module.store;

			// sum up xp stuff
			for (var i = 1; i < statsRows.length; i++) {

				var entry = statsRows[i];
				var matchDate = statsRows[i].querySelector('td.keyColumn');
				if (matchDate) {
					let dateSpan = matchDate.querySelector('span.float_left');
					let dateStr = dateSpan.title || dateSpan.dataset.dateiso;
					var date = Foxtrick.util.time.getDateFromText(dateStr);

					// current skilllevel
					var xpNow = parseInt(entry.cells[module.XP_CELL_IDX].textContent, 10);

					// remember current XP Level to detect skilldowns
					if (store.currentSkill === null)
						store.currentSkill = xpNow;

					var u20 = /U-20/.test(statsRows[i].querySelector('a').textContent);
					var ntMatch = isNTMatch(entry);
					var gameType = getGameType(entry, date, u20);
					var minutes = getPlayedMinutes(entry);
					var pseudoPoints = getXpGain(minutes, gameType); // for visualization
					var walkover = isWalkover(entry);

					// reset both xp_gain and minute count if it's a WO
					var xpGain = walkover ? minutes = 0 : pseudoPoints;

					// set min/max values for friendlies
					var dxp = getXPMinMaxDifference(ntMatch, xpGain, gameType);
					if (xpNow === store.currentSkill) {
						// store all until XP is lower than curremt
						store.matches[gameType].xp.min += dxp.min;
						store.matches[gameType].xp.max += dxp.max;
						store.matches[gameType].minutes.min += minutes;
						store.matches[gameType].minutes.max += minutes;
						store.matches[gameType].count.min += minutes / 90.0;
						store.matches[gameType].count.max += minutes / 90.0;

						store.xp.points.min += dxp.min;
						store.xp.points.max += dxp.max;
						store.xp.xp.min += dxp.min / module.XP_PTS_PER_LEVEL;
						store.xp.xp.max += dxp.max / module.XP_PTS_PER_LEVEL;

						store.last = {};
						store.last.node = statsRows[i];
						store.last.nodeIndex = i;
						store.last.gameType = gameType;
						store.last.min = dxp.min;
						store.last.max = dxp.max;
						store.last.minutes = minutes;
						store.last.count = minutes / 90.0;
					}
					else {
						// store.last points to the skill up row
						store.skillup = true;
					}

					var tdXP = Foxtrick.insertFeaturedCell(entry, module, module.XP_CELL_IDX + 1);
					Foxtrick.addClass(tdXP, 'stats');
					if (walkover) {
						Foxtrick.addClass(tdXP, 'ft-xp-walkover');
						tdXP.textContent = pseudoPoints.toFixed(3);
						tdXP.title = WO_TITLE;
					}
					else {
						tdXP.textContent = xpGain.toFixed(3);
					}

					if (!ntMatch && gameType == 'matchFriendly' && minutes > 0)
						tdXP.textContent = (xpGain / 2.0).toFixed(3) + '/' + xpGain.toFixed(3);
				}
				else {
					break;
				}
			}

			if (!store.last)
				return;

			// highlight the relevant skillup game in the table
			Foxtrick.addClass(store.last.node, 'ft-xp-skillup');
			Foxtrick.addClass(statsRows[store.last.nodeIndex], 'ft-xp-skillup');

			// adjust minimum gained xp depending on the relevant skillup game
			store.matches[store.last.gameType].minutes.min -= store.last.minutes;
			store.matches[store.last.gameType].count.min -= store.last.minutes / 90.0;
			store.matches[store.last.gameType].xp.min -= store.last.min;

			store.xp.points.min -= store.last.min;
			store.xp.xp.min -= store.last.min / module.XP_PTS_PER_LEVEL;
		};

		var addHead = function(table) {
			var thead = doc.createElement('thead');
			table.appendChild(thead);

			var cell;
			var theadRow = doc.createElement('tr');

			cell = doc.createElement('th');
			cell.textContent = Foxtrick.L10n.getString('PlayerStatsExperience.MatchesSinceSkilup');
			theadRow.appendChild(cell);

			cell = doc.createElement('th');
			Foxtrick.addClass(cell, 'ft-xp-data-value');
			cell.textContent = Foxtrick.L10n.getString('PlayerStatsExperience.matches');
			theadRow.appendChild(cell);

			cell = doc.createElement('th');
			Foxtrick.addClass(cell, 'ft-xp-data-value');
			cell.textContent = Foxtrick.L10n.getString('PlayerStatsExperience.minutes');
			theadRow.appendChild(cell);

			cell = doc.createElement('th');
			Foxtrick.addClass(cell, 'ft-xp-data-value');
			cell.textContent = Foxtrick.L10n.getString('PlayerStatsExperience.minXPpts');
			theadRow.appendChild(cell);

			cell = doc.createElement('th');
			Foxtrick.addClass(cell, 'ft-xp-data-value');
			cell.textContent = Foxtrick.L10n.getString('PlayerStatsExperience.maxXPpts');
			theadRow.appendChild(cell);

			thead.appendChild(theadRow);
		};

		var addBody = function(table) {
			var tbody = doc.createElement('tbody');
			table.appendChild(tbody);

			var types = module.matchTypes;
			var store = module.store;

			var format = function(value) {
				return value - Math.floor(value) > 0 ? value.toFixed(3) : Math.floor(value);
			};

			var addTotals = function() {

				var isCompleteClass = module.store.skillup ? 'ft-xp-complete' : 'ft-xp-incomplete';

				// xp pts
				var row = doc.createElement('tr');
				var cell;
				cell = doc.createElement('td');
				cell.textContent = Foxtrick.L10n.getString('PlayerStatsExperience.sum');
				row.appendChild(cell);

				cell = doc.createElement('td');
				cell.colSpan = 2;
				row.appendChild(cell);

				cell = doc.createElement('td');
				cell.id = 'ft-xp-min-pts';
				Foxtrick.addClass(cell, 'ft-xp-data-value ' + isCompleteClass);
				cell.textContent = format(store.xp.points.min);
				row.appendChild(cell);

				cell = doc.createElement('td');
				cell.id = 'ft-xp-max-pts';
				Foxtrick.addClass(cell, 'ft-xp-data-value ' + isCompleteClass);
				cell.textContent = format(store.xp.points.max);
				row.appendChild(cell);
				tbody.appendChild(row);

				// xp actual
				row = doc.createElement('tr');
				cell = doc.createElement('td');
				var bold = doc.createElement('strong');
				bold.textContent = Foxtrick.L10n.getString('PlayerStatsExperience.Experience');
				cell.appendChild(bold);
				row.appendChild(cell);

				cell = doc.createElement('td');
				cell.colSpan = 2;
				row.appendChild(cell);

				cell = doc.createElement('td');
				cell.id = 'ft-xp-min';
				Foxtrick.addClass(cell, 'ft-xp-data-value ' + isCompleteClass);
				cell.textContent = format(store.currentSkill + store.xp.xp.min);
				row.appendChild(cell);

				cell = doc.createElement('td');
				cell.id = 'ft-xp-max';
				Foxtrick.addClass(cell, 'ft-xp-data-value ' + isCompleteClass);
				cell.textContent = format(store.currentSkill + store.xp.xp.max);
				row.appendChild(cell);

				tbody.appendChild(row);

			};
			var addRow = function(type, count, minutes, xp, i) {
				var row = doc.createElement('tr');
				var cell;

				if (i % 2)
					Foxtrick.addClass(row, 'darkereven');
				else
					Foxtrick.addClass(row, 'odd');

				cell = doc.createElement('td');
				cell.id = 'ft-xp-' + type + '-desc';
				cell.textContent = Foxtrick.L10n.getString('PlayerStatsExperience.' + type);
				row.appendChild(cell);

				cell = doc.createElement('td');
				if (count.min === count.max)
					cell.textContent = count.max;
				else
					cell.textContent = count.min + ' - ' + count.max;
				cell.id = 'ft-xp-' + type + '-count';
				Foxtrick.addClass(cell, 'ft-xp-data-value');
				row.appendChild(cell);

				cell = doc.createElement('td');
				if (minutes.min === minutes.max)
					cell.textContent = minutes.max;
				else
					cell.textContent = minutes.min + ' - ' + minutes.max;
				cell.id = 'ft-xp-' + type + '-minutes';
				Foxtrick.addClass(cell, 'ft-xp-data-value');
				row.appendChild(cell);

				// marks the game that causes prediction error (first game after skillup)
				var skillup = '';
				if (store.last.gameType === type && store.skillup)
					skillup = 'ft-xp-skillup';

				cell = doc.createElement('td');
				cell.id = 'ft-xp-' + type + '-min';
				Foxtrick.addClass(cell, 'ft-xp-data-value ' + skillup);
				cell.textContent = xp.min;
				row.appendChild(cell);

				cell = doc.createElement('td');
				cell.id = 'ft-xp-' + type + '-max';
				Foxtrick.addClass(cell, 'ft-xp-data-value ' + skillup);
				cell.textContent = xp.max;
				row.appendChild(cell);

				tbody.appendChild(row);
			};

			for (var i = 0, j = 0; i < types.length; i++) {
				var count = store.matches[types[i]].count;
				count.min = format(count.min);
				count.max = format(count.max);
				var minutes = store.matches[types[i]].minutes;
				var xp = store.matches[types[i]].xp;
				xp.min = format(xp.min);
				xp.max = format(xp.max);
				var type = types[i];

				if (xp.max) {
					// don't show empty rows
					addRow(type, count, minutes, xp, j++);
				}
			}
			addTotals();
		};

		var addComments = function(commentDiv, showAllLink) {
			var span = doc.createElement('span');
			commentDiv.appendChild(span);
			commentDiv.appendChild(doc.createElement('br'));

			span = doc.createElement('span');
			var ptsPerLevel = Foxtrick.L10n.getString('PlayerStatsExperience.PtsPerLevel');
			span.textContent = ptsPerLevel.replace(/%1/, module.XP_PTS_PER_LEVEL.toFixed(3));
			commentDiv.appendChild(span);
			commentDiv.appendChild(doc.createElement('br'));

			if (!module.store.skillup) {
				span = doc.createElement('span');
				var str = showAllLink ?
					'PlayerStatsExperience.NotAllMatchesVisible' :
					'PlayerStatsExperience.NoSkillUpFound';

				span.textContent = Foxtrick.L10n.getString(str);
				commentDiv.appendChild(span);
				commentDiv.appendChild(doc.createElement('br'));
			}
		};

		var convertLinksToShowAll = function() {
			var allLinks = doc.getElementsByTagName('a');
			for (var l = 0; l < allLinks.length; l++) {
				if (/PlayerStats\.aspx/i.test(allLinks[l].href)) {
					if (!/ShowAll=True/i.test(allLinks[l].href))
						allLinks[l].href += '&ShowAll=True';
				}
			}
		};

		// START

		// find showAllLink if any
		// used for comments and cloning
		var showAllLink = null;
		if (!/ShowAll=True/i.test(doc.location.href)) {
			var links = doc.getElementsByTagName('a');
			showAllLink = Foxtrick.nth(function(link) {
				return /ShowAll=True/i.test(link.href);
			}, links);
		}

		// get all possible links to show max amount of games
		if (Foxtrick.Prefs.isModuleOptionEnabled('PlayerStatsExperience', 'AlwaysShowAll')) {
			// makes sure all links pointing to other player stats will show all possible matches
			convertLinksToShowAll();
		}

		if (Foxtrick.isPage(doc, 'playerDetails'))
			return;

		// both tables you can alternate between atm
		var statsTable = doc.querySelector('.alltidMatches');
		if (!statsTable)
			return;

		runStatsTables(statsTable);

		var matchListTable = Foxtrick.createFeaturedElement(doc, module, 'div');
		var table = doc.createElement('table');
		Foxtrick.addClass(table, 'ft-ignore-changes');
		matchListTable.appendChild(table);
		addHead(table);
		addBody(table);

		var commentDiv = Foxtrick.createFeaturedElement(doc, module, 'div');
		addComments(commentDiv, showAllLink);

		var entry = doc.querySelector('.mainBox');

		var xpHeader = doc.createElement('h2');
		var headerTitle = Foxtrick.L10n.getString('PlayerStatsExperience.Experience');
		xpHeader.textContent = headerTitle;
		entry.parentNode.insertBefore(xpHeader, entry);
		entry.parentNode.insertBefore(matchListTable, entry);
		entry.parentNode.insertBefore(commentDiv, entry);

		// if more matches are required, clone showall link for easier access to top of table
		if (showAllLink && !module.store.skillup) {
			var showAllLinkClone = showAllLink.cloneNode(true);
			entry.parentNode.insertBefore(showAllLinkClone, entry);
		}

		// header for the old table
		var tableHeader = doc.createElement('h2');
		tableHeader.title = Foxtrick.L10n.getString('PlayerStatsExperience.PerformanceHistory');
		entry.parentNode.insertBefore(tableHeader, entry);

	},
};
