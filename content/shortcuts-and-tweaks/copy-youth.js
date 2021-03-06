/**
* copy-youth.js
* Copy functions for youth sources
* @author larsw84, convincedd, Parminu, ryanli
*/

'use strict';

Foxtrick.modules.CopyYouth = {
	MODULE_CATEGORY: Foxtrick.moduleCategories.SHORTCUTS_AND_TWEAKS,
	PAGES: ['youthTraining', 'youthPlayerDetails', 'youthOverview',
		'youthFixtures'],
	OPTIONS: [
		'TrainingReport', 'AutoSendTrainingReportToHY', 'ScoutComment',
		'AutoSendRejectedToHY', 'AutoSendTrainingChangesToHY', 'FixturesSource',
	],

	CSS: Foxtrick.InternalPath + 'resources/css/copy-youth.css',

	/**
	 * @param {document}           doc
	 * @param {string|HTMLElement} text
	 * @param {number}             [timeout]
	 */
	addNode: function(doc, text, timeout) {
		Foxtrick.util.note.add(doc, text, null, { timeout: timeout });
	},

	/** @param {document} doc */
	addTrainingReport: function(doc) {
		const module = this;

		/**
		 * copy function
		 * @type {Listener<HTMLElement, MouseEvent>}
		 */
		var copyReport = function() {
			try {
				let mainBody = doc.getElementById('mainBody');

				const matchId = Foxtrick.util.id.findMatchId(mainBody);

				let playerInfo = mainBody.querySelector('.playerInfo');
				let clone = playerInfo.cloneNode(true);

				// eslint-disable-next-line no-magic-numbers
				for (let _ of Foxtrick.range(4)) { // remove greeting: text, p, text, strong
					clone.removeChild(clone.firstChild);
				}
				// eslint-disable-next-line no-magic-numbers
				for (let _ of Foxtrick.range(5)) { // remove end phrase: text, br, text, br, text
					clone.removeChild(clone.lastChild);
				}

				let plain = clone.textContent;
				plain = plain.replace(/\s+\n\s+/g, '\n\n');
				plain = plain.trim();
				plain += '\n';

				Foxtrick.copy(doc, plain);

				// display note
				let server = Foxtrick.Prefs.getBool('hty-stage') ? 'stage' : 'www';
				let url = 'https://' + server +
					'.hattrick-youthclub.org/site/coachcomments_add/htmatch/' + matchId;
				let copied = Foxtrick.L10n.getString('copy.trainingReport.copied');

				let container = doc.createElement('div');
				let p = doc.createElement('p');
				p.textContent = copied;
				container.appendChild(p);

				let linkContainer = doc.createElement('div');
				let [start, end] = Foxtrick.L10n.getString('button.goto').split('%s');
				linkContainer.textContent = start;

				let a = doc.createElement('a');
				a.href = url;
				a.target = '_copyYouth';
				a.textContent = url;

				linkContainer.appendChild(a);
				linkContainer.appendChild(doc.createTextNode(end));
				container.appendChild(linkContainer);

				Foxtrick.util.note.add(doc, container, 'ft-training-report-copy-note');
			}
			catch (e) {
				Foxtrick.log(e);
			}
		};

		/**
		 * @param {number} matchId
		 * @param {HTMLElement} trainerNode
		 * @param {HTMLElement} reportNode
		 * @param {ArrayLike<HTMLSelectElement>} training
		 */
		var sendTrainingReportToHY = function(matchId, trainerNode, reportNode, training) {
			let [primary, secondary] = Array.from(training);

			// assemble param string
			let params = 'report=' + encodeURIComponent(reportNode.innerHTML);
			params += '&matchId=' + matchId;
			params += '&trainer=' + encodeURIComponent(trainerNode.innerHTML);
			params += '&lang=' + Foxtrick.modules.ReadHtPrefs.readLanguageFromMetaTag(doc);
			params += '&primaryTraining=' + primary.value;
			params += '&secondaryTraining=' + secondary.value;

			let ok = 'module.CopyYouth.AutoSendTrainingReportToHY.success';
			ok = Foxtrick.L10n.getString(ok);

			const entry = doc.getElementById('mainBody');
			const loading = Foxtrick.util.note.createLoading(doc);
			entry.insertBefore(loading, entry.firstChild);

			// eslint-disable-next-line no-magic-numbers
			const success = () => module.addNode(doc, ok, 3000);
			const eCb = (resp, st) => module.addNode(doc, `Error ${st}: ${JSON.parse(resp).error}`);
			const finalize = () => entry.removeChild(loading);
			Foxtrick.api.hy.postMatchReport(success, params, eCb, finalize);
		};

		// if training report unread mark dirty on click so auto send to HY can kick in
		let readBtn = Foxtrick.getButton(doc, 'ReadAll');
		if (readBtn) {
			if (Foxtrick.Prefs.isModuleOptionEnabled(module, 'AutoSendTrainingReportToHY')) {
				let readBtn = Foxtrick.getButton(doc, 'ReadAll');
				Foxtrick.onClick(readBtn, function() {
					Foxtrick.log('Marked');
					Foxtrick.sessionSet('YouthClub.sendTrainingReport', true);
				});
			}
			return;
		}

		// add button
		let copyL10n = Foxtrick.L10n.getString('copy.trainingReport');
		let button = Foxtrick.util.copyButton.add(doc, copyL10n);
		if (button) {
			Foxtrick.addClass(button, 'ft-copy-training-report');
			Foxtrick.onClick(button, copyReport);
		}

		// if the user is a HY user
		// send the TrainingReport to HY automatically
		if (!Foxtrick.Prefs.isModuleOptionEnabled(module, 'AutoSendTrainingReportToHY'))
			return;

		// DEBUG: Always send this report, can be used to test
		// Foxtrick.sessionSet('YouthClub.sendTrainingReport', true);

		Foxtrick.api.hy.runIfHYUser(function() {
			var mainBody = doc.getElementById('mainBody');
			var matchid = Foxtrick.util.id.findMatchId(mainBody);
			Foxtrick.sessionGet('YouthClub.sendTrainingReport', (value) => {
				if (!value) {
					Foxtrick.log('Not sending to HY, YouthClub.sendTrainingReport', value);
					return;
				}

				Foxtrick.log('Sending to HY, YouthClub.sendTrainingReport', value);
				Foxtrick.sessionSet('YouthClub.sendTrainingReport', false);

				/** @type {HTMLElement} */
				let trainerNode = doc.querySelector('#mainBody .pmAvatar');

				/** @type {HTMLElement} */
				let reportNode = doc.querySelector('.playerInfo');

				/** @type {NodeListOf<HTMLSelectElement>} */
				let training = doc.querySelectorAll('#mainBody table.form select');
				sendTrainingReportToHY(matchid, trainerNode, reportNode, training);
			});
		});
	},

	/** @param {document} doc */
	addScoutComment: function(doc) {
		const module = this;

		/** @param {boolean} sendToHY */
		var copyReport = function(sendToHY) {
			try {
				var mainBody = doc.getElementById('mainBody');

				/** @type {HTMLElement} */
				let mInfo = mainBody.querySelector('.managerInfo');

				/** @type {NodeListOf<HTMLElement>} */
				let mainBoxes = mainBody.querySelectorAll('.mainBox');
				let lastMain = [...mainBoxes].pop();

				let info = mInfo || lastMain;
				if (!info)
					return;

				if (info.dataset.ftInProgress == '1')
					return;

				info.dataset.ftInProgress = '1';

				let clone = /** @type {HTMLElement} */ (info.cloneNode(true));
				let header = clone.querySelector('h3, h2');
				if (header)
					header.remove();

				let plain = clone.innerHTML;
				plain = plain.replace(/&nbsp;/ig, ' ');

				// remove leading whitespace
				plain = plain.replace(/^\s+/, '');

				// replace inner multiple whitespace by single whitespace
				plain = plain.replace(/\s+/g, ' ');

				// replace <br> with and w/o whitespace with newline
				plain = plain.replace(/<br ?\/?>\s+/ig, '\n');
				plain = plain.replace(/<br>|<\/h2> |<\/h3>/ig, '\n');

				plain = Foxtrick.stripHTML(plain);

				// remove last three paragraphs (two newlines and a sentence
				// like 'What do you say? Should we give him a chance?'
				let paragraphs = plain.split(/\n/);
				// eslint-disable-next-line no-magic-numbers
				paragraphs = paragraphs.splice(0, paragraphs.length - 3);
				plain = paragraphs.join('\n');

				Foxtrick.copy(doc, plain);

				// auto send the rejected player to HY

				// eslint-disable-next-line no-extra-parens
				let reportNode = /** @type {HTMLElement} */ (info.cloneNode(true));
				let img = reportNode.querySelector('img');
				if (img)
					img.parentNode.removeChild(img);

				let alert = reportNode.querySelector('.alert');
				if (alert)
					alert.parentNode.removeChild(alert);

				var sendScoutCallToHY = function() {
					// assemble param string
					let params = 'scoutcall=' + encodeURIComponent(reportNode.innerHTML);
					params = params + '&lang=' +
						Foxtrick.modules['ReadHtPrefs'].readLanguageFromMetaTag(doc);
					let ok = 'module.CopyYouth.AutoSendRejectedToHY.success';
					ok = Foxtrick.L10n.getString(ok);

					let entry = doc.getElementById('mainBody');
					let loading = Foxtrick.util.note.createLoading(doc);
					entry.insertBefore(loading, entry.firstChild);

					// eslint-disable-next-line no-magic-numbers
					const success = () => module.addNode(doc, ok, 3000);
					const fCb = (resp, st) => {
						module.addNode(doc, `Error ${st}: ${JSON.parse(resp).error}`);
					};
					const finalize = () => {
						info.dataset.ftInProgress = '0';
						entry.removeChild(loading);
					};
					Foxtrick.api.hy.postScoutCall(success, params, fCb, finalize);
				};

				// only when clicking the reject btn
				if (sendToHY && typeof sendToHY == 'boolean') {
					Foxtrick.api.hy.runIfHYUser(function() {
						Foxtrick.log('HY user, sending rejected call to HY');
						sendScoutCallToHY();
					});
				}
				else {
					info.dataset.ftInProgress = '0';
					Foxtrick.log('Manual copy of scout call.');
					module.addNode(doc, Foxtrick.L10n.getString('copy.scoutComment.copied'));
				}
			}
			catch (e) {
				Foxtrick.log(e);
			}
		};

		let hasReport = false;
		if (Foxtrick.isPage(doc, 'youthOverview'))
			hasReport = Foxtrick.getButton(doc, 'ScoutPropYes') !== null;

		if (!Foxtrick.isPage(doc, 'youthPlayerDetails') && !hasReport)
			return;

		if (hasReport) {
			let alertdiv = Foxtrick.getButton(doc, 'ScoutPropYes').parentNode;
			let [acceptButton, rejectButton] = alertdiv.querySelectorAll('input');

			// auto send rejected players to HY, api see above
			if (Foxtrick.Prefs.isModuleOptionEnabled(module, 'AutoSendRejectedToHY')) {
				let reject = Foxtrick.L10n.getString('module.CopyYouth.AutoSendRejectedToHY.desc');
				rejectButton.title = reject;
				Foxtrick.onClick(rejectButton, () => copyReport(true));

				// DEBUG: fake link, used to simulate sending data to HY
				// without actually rejecting the player

				// let fakeReject = doc.createElement('a');
				// fakeReject.textContent = 'Fake reject';
				// rejectButton.parentNode.appendChild(fakeReject);
				// Foxtrick.onClick(fakeReject, () => copyReport(true));
			}
			else if (alertdiv.parentNode.querySelector('a') == null &&
			         doc.getElementById('ft-copy-scout-comment-link') == null) {

				let copyLink = doc.createElement('a');
				copyLink.textContent = Foxtrick.L10n.getString('copy.scoutComment');
				copyLink.href = '#mainBody';
				copyLink.id = 'ft-copy-scout-comment-link';
				Foxtrick.onClick(copyLink, () => copyReport(false));
				alertdiv.parentNode.insertBefore(copyLink, alertdiv);
			}

			// setting the cookie in case of pull
			Foxtrick.onClick(acceptButton, () => Foxtrick.cookies.set('for_hty', { pull: true }));

			// DEBUG
			// let fakeAccept = doc.createElement('a');
			// fakeAccept.textContent = 'Fake accept';
			// acceptButton.parentNode.appendChild(fakeAccept);
			// Foxtrick.onClick(fakeAccept, () => Foxtrick.cookies.set('for_hty', { pull: true }));
		}

		// add button
		if (!doc.getElementById('ft-copy-scout-comment-button')) {
			let fired = Foxtrick.Pages.YouthPlayer.wasFired(doc);
			let isOwn = Foxtrick.Pages.All.isOwn(doc);
			if (fired || !isOwn)
				return;

			let copy = Foxtrick.L10n.getString('copy.scoutComment');
			let button = Foxtrick.util.copyButton.add(doc, copy);
			if (button) {
				button.id = 'ft-copy-scout-comment-button';
				Foxtrick.addClass(button, 'ft-copy-scout-comment');
				Foxtrick.onClick(button, () => copyReport(false));
			}
		}
	},

	/**
	 * monitor training changes and send them to HY
	 * @param {document} doc
	 */
	monitorTraining: function(doc) {
		const module = this;

		/** @param {ArrayLike<HTMLSelectElement>} training */
		var sendTrainingChangeToHY = function(training) {
			let [primary, secondary] = Array.from(training);

			// assemble param string
			let params = 'primaryTraining=' + primary.value;
			params = params + '&secondaryTraining=' + secondary.value;
			let ok = 'module.CopyYouth.AutoSendTrainingChangesToHY.success';
			ok = Foxtrick.L10n.getString(ok);

			let entry = doc.getElementById('mainBody');
			let loading = Foxtrick.util.note.createLoading(doc);
			entry.insertBefore(loading, entry.firstChild);

			// eslint-disable-next-line no-magic-numbers
			const success = () => module.addNode(doc, ok, 3000);
			const fCb = (resp, st) => {
				module.addNode(doc, `Error ${st}: ${JSON.parse(resp).error}`);
			};
			const finalize = () => entry.removeChild(loading);

			Foxtrick.api.hy.postTrainingChange(success, params, fCb, finalize);
		};

		let changeBtn = Foxtrick.getButton(doc, 'ChangeTraining');

		/** @type {NodeListOf<HTMLSelectElement>} */
		var training = doc.querySelectorAll('#mainBody table.form select');
		if (!changeBtn || training.length != 2)
			return;

		Foxtrick.api.hy.runIfHYUser(function() {
			Foxtrick.sessionGet('YouthClub.sendTrainingChange', function(send) {
				if (!send)
					return;

				Foxtrick.sessionSet('YouthClub.sendTrainingChange', false);
				sendTrainingChangeToHY(training);
			});

			Foxtrick.onClick(changeBtn, function(ev) {
				Foxtrick.sessionSet('YouthClub.sendTrainingChange', true);
			});
		});
	},

	/** @param {document} doc */
	addFixturesSource: function(doc) {
		var copySource = function() {
			var fixBr = function(text) {
				return text.replace(/<br\/?>/g, '<br />');
			};

			try {
				let html = '<html>' + doc.documentElement.innerHTML + ' </html>';
				html = fixBr(html);
				Foxtrick.copy(doc, html, 'text/html');

				// display note
				let container = doc.createElement('div');
				let p = doc.createElement('p');
				p.textContent = Foxtrick.L10n.getString('copy.fixturesSource.copied');
				container.appendChild(p);

				// README: host down
				// let linkContainer = doc.createElement('div');
				// let [start, end] = Foxtrick.L10n.getString('button.goto').split('%s');
				// linkContainer.textContent = start;

				// let url = 'http://www.ht-ys.org/read_fixtures';
				// let a = doc.createElement('a');
				// a.href = url;
				// a.target = '_ht_ys';
				// a.textContent = 'http://www.ht-ys.org';
				// linkContainer.appendChild(a);
				// linkContainer.appendChild(doc.createTextNode(end));
				// container.appendChild(linkContainer);

				Foxtrick.util.note.add(doc, container, 'ft-youthfixtures-source-copy-note');
			}
			catch (e) {
				Foxtrick.log(e);
			}
		};

		let copyL10n = Foxtrick.L10n.getString('copy.fixturesSource');
		let button = Foxtrick.util.copyButton.add(doc, copyL10n);
		if (button) {
			Foxtrick.addClass(button, 'ft-copy-fixtures-source');
			Foxtrick.onClick(button, copySource);
		}
	},

	/** @param {document} doc */
	run: function(doc) {
		const module = this;

		if (Foxtrick.Prefs.isModuleOptionEnabled(module, 'TrainingReport') &&
		    Foxtrick.isPage(doc, 'youthTraining'))
			module.addTrainingReport(doc);

		if (Foxtrick.Prefs.isModuleOptionEnabled(module, 'AutoSendTrainingChangesToHY') &&
		    Foxtrick.isPage(doc, 'youthTraining'))
			module.monitorTraining(doc);

		if (Foxtrick.Prefs.isModuleOptionEnabled(module, 'ScoutComment') &&
		    Foxtrick.isPage(doc, ['youthPlayerDetails', 'youthOverview']))
			module.addScoutComment(doc);

		if (Foxtrick.Prefs.isModuleOptionEnabled(module, 'FixturesSource') &&
		    Foxtrick.isPage(doc, 'youthFixtures'))
			module.addFixturesSource(doc);

	},

	/** @param {document} doc */
	change: function(doc) {
		const module = this;

		if (Foxtrick.Prefs.isModuleOptionEnabled(module, 'ScoutComment') &&
		    Foxtrick.isPage(doc, 'youthOverview'))
			module.addScoutComment(doc);
	},
};
