'use strict';
/*
 * scripts-fennec.js
 * content script inject for fennec
 */

if (!Foxtrick)
	var Foxtrick = {};
if (!Foxtrick.loader)
	Foxtrick.loader = {};
if (!Foxtrick.loader.background)
	Foxtrick.loader.background = {};

Foxtrick.loader.background.contentScriptManager = {
	contentScripts: [
		//<!-- essential stuffs -->
		'env.js',
		'prefs.js',
		'l10n.js',
		'xml-load.js',
		'pages.js',

		//<!-- utilities -->
		'util/api.js',
		'util/array.js',
		'util/color.js',
		'util/cookies.js',
		'util/copy-button.js',
		'util/css.js',
		'util/currency.js',
		'util/dom.js',
		'util/ht-ml.js',
		'util/id.js',
		'util/inject.js',
		'util/layout.js',
		'util/links-box.js',
		'util/load.js',
		'util/local-store.js',
		'util/log.js',
		'util/match-view.js',
		'util/misc.js',
		'util/module.js',
		'util/note.js',
		'util/notify.js',
		'util/permissions.js',
		'util/sanitize.js',
		'util/session-store.js',
		'util/string.js',
		'util/tabs.js',
		'util/time.js',

		//<!-- external libraries -->
		'lib/oauth.js',
		'lib/sha1.js',
		'lib/jquery.js',
		'lib/jester.js',
		'lib/yaml.js',
		'lib/BlobBuilder.min.js',
		'lib/FileSaver.min.js',
		'lib/psico.js',

		//<!-- core modules -->
		'redirections.js',
		'read-ht-prefs.js',
		'forum-stage.js',
		'core.js',
		'add-class.js',
		'fix-links.js',

		//<!-- page utilities -->
		'pages/all.js',
		'pages/country.js',
		'pages/players.js',
		'pages/player.js',
		'pages/youth-player.js',
		'pages/transfer-search-results.js',
		'pages/match.js',
		'pages/matches.js',

		//<!-- api utilities -->
		'api/hy/common.js',
		'api/hy/user-id.js',
		'api/hy/players-youth-skills.js',
		'api/hy/players-twins-check.js',
		'api/hy/players-youth-reject-call.js',
		'api/hy/matches-report.js',
		'api/hy/matches-training.js',

		//<!-- categorized modules -->
		"access/aria-landmarks.js",
		"alert/live-alert.js",
		"alert/new-mail.js",
		"alert/ticker-alert.js",
		"alert/ticker-coloring.js",
		"forum/auto-post-specs.js",
		"forum/embed-media.js",
		"forum/forum-change-posts.js",
		"forum/forum-change-posts-modules.js",
		"forum/forum-direct-page-links.js",
		"forum/forum-last-post.js",
		"forum/forum-leave-button.js",
		"forum/forum-next-and-previous.js",
		"forum/forum-mod-popup.js",
		"forum/forum-presentation.js",
		"forum/forum-preview.js",
		"forum/forum-strip-hattrick-links.js",
		"forum/forum-templates.js",
		"forum/forum-thread-auto-ignore.js",
		"forum/forum-youth-icons.js",
		"forum/go-to-post-box.js",
		"forum/hide-signatures.js",
		"forum/ht-thread-marker.js",
		"forum/mark-all-as-read.js",
		"forum/mark-unread.js",
		"forum/show-forum-pref-button.js",
		"forum/staff-marker.js",
		"information-aggregation/cross-table.js",
		"information-aggregation/dashboard-calendar.js",
		"information-aggregation/election-table.js",
		"information-aggregation/extended-player-details.js",
		"information-aggregation/extra-player-info.js",
		"information-aggregation/flag-collection-to-map.js",
		"information-aggregation/goal-difference-to-tables.js",
		"information-aggregation/history-stats.js",
		"information-aggregation/htms-points.js",
		"information-aggregation/last-login.js",
		"information-aggregation/median-transfer-price.js",
		"information-aggregation/my-monitor.js",
		"information-aggregation/nt-peek.js",
		"information-aggregation/player-birthday.js",
		"information-aggregation/player-stats-experience.js",
		"information-aggregation/psico-tsi.js",
		"information-aggregation/season-stats.js",
		"information-aggregation/series-flags.js",
		"information-aggregation/show-friendly-booked.js",
		"information-aggregation/show-lineup-set.js",
		"information-aggregation/skill-table.js",
		"information-aggregation/supporterstats-enhancements.js",
		"information-aggregation/table-of-statistical-truth.js",
		"information-aggregation/team-stats.js",
		"information-aggregation/transfer-deadline.js",
		"information-aggregation/youth-promotes.js",
		"information-aggregation/youth-series-estimation.js",
		"information-aggregation/youth-skills.js",
		"information-aggregation/youth-twins.js",
		"links/links-achievements.js",
		"links/links-alliances.js",
		"links/links-arena.js",
		"links/links-challenges.js",
		"links/links-club-transfers.js",
		"links/links-coach.js",
		"links/links-country.js",
		"links/links-economy.js",
		"links/links-fans.js",
		"links/links.js",
		"links/links-league.js",
		"links/links-manager.js",
		"links/links-match.js",
		"links/links-national.js",
		"links/links-player-detail.js",
		"links/links-players.js",
		"links/links-staff.js",
		"links/links-team.js",
		"links/links-tracker.js",
		"links/links-training.js",
		"links/links-youth.js",
		"links/links-world.js",
		"matches/att-vs-def.js",
		"matches/live-match-report-format.js",
		"matches/copy-ratings.js",
		"matches/htev-prediction.js",
		"matches/htms-prediction.js",
		"matches/match-income.js",
		"matches/match-lineup-fixes.js",
		"matches/match-lineup-tweaks.js",
		"matches/match-order.js",
		"matches/match-player-colouring.js",
		"matches/match-report-format.js",
		"matches/match-simulator.js",
		"matches/ratings.js",
		"matches/stars-counter.js",
		"presentation/bookmark-adjust.js",
		"presentation/country-list.js",
		"presentation/currency-converter.js",
		"presentation/custom-medals.js",
		"presentation/fans.js",
		"presentation/fix-css-problems.js",
		"presentation/friendly-interface.js",
		"presentation/friendly-pool.js",
		"presentation/header-fix.js",
		"presentation/header-toggle.js",
		"presentation/highlight-cup-wins.js",
		"presentation/highlight-ownerless.js",
		"presentation/ht-date-format.js",
		"presentation/large-flags.js",
		"presentation/league-news-filter.js",
		"presentation/local-time.js",
		"presentation/loyalty-display.js",
		"presentation/match-tables.js",
		"presentation/mobile-enhancements.js",
		"presentation/move-manager-online.js",
		"presentation/move-player-select-box.js",
		"presentation/move-player-statement.js",
		"presentation/old-style-face.js",
		"presentation/original-face.js",
		"presentation/personality-images.js",
		"presentation/player-stats-training-week.js",
		"presentation/ratings-display.js",
		"presentation/safe-for-work.js",
		"presentation/simple-presentation.js",
		"presentation/skill-coloring.js",
		"presentation/skill-translation.js",
		"presentation/skin-plugin.js",
		"presentation/smaller-pages.js",
		"presentation/supporters-list.js",
		"presentation/tabs-test.js",
		"presentation/team-select-box.js",
		"presentation/youth-skill-hide-unknown.js",
		"shortcuts-and-tweaks/confirm-actions.js",
		"shortcuts-and-tweaks/context-menu-copy.js",
		"shortcuts-and-tweaks/copy-bb-ad.js",
		"shortcuts-and-tweaks/copy-match-id.js",
		"shortcuts-and-tweaks/copy-player-ad.js",
		"shortcuts-and-tweaks/copy-youth.js",
		"shortcuts-and-tweaks/extra-shortcuts.js",
		"shortcuts-and-tweaks/filter.js",
		"shortcuts-and-tweaks/lineup-shortcut.js",
		"shortcuts-and-tweaks/main-menu-drop-down.js",
		"shortcuts-and-tweaks/manager-buttons.js",
		"shortcuts-and-tweaks/player-filters.js",
		"shortcuts-and-tweaks/rapid-id.js",
		"shortcuts-and-tweaks/relive-links.js",
		"shortcuts-and-tweaks/senior-team-shortcuts.js",
		"shortcuts-and-tweaks/supportership-expiration-date.js",
		"shortcuts-and-tweaks/table-sort.js",
		"shortcuts-and-tweaks/team-popup-links.js",
		"shortcuts-and-tweaks/transfer-history-filters.js",
		"shortcuts-and-tweaks/transfer-search-filters.js",
		"shortcuts-and-tweaks/transfer-search-result-filters.js",
		//<!-- end categorized modules -->

		'env-fennec.js',
		'ui.js',
		'entry.js',
		'loader-fennec.js'
	],

	load: function() {
		// load content scripts into content pages. those start running in loader-fennec
		for (var i = 0; i < this.contentScripts.length; ++i)
			messageManager.loadFrameScript('chrome://foxtrick/content/' +
			                               this.contentScripts[i], true);
	},

	unload: function() {
		// tell content script to unload
		sandboxed.extension.broadcastMessage('unload');

		// unload content scripts
		for (var i = 0; i < this.contentScripts.length; ++i)
			messageManager.removeDelayedFrameScript('chrome://foxtrick/content/' +
			                                        this.contentScripts[i]);
	},
};