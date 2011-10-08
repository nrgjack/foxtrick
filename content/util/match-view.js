"use strict";
/* match-view.js
 * utilities for match view
 *
 * @author ryanli
 */

if (!Foxtrick) var Foxtrick = {};
if (!Foxtrick.util) Foxtrick.util = {};
Foxtrick.util.matchView = {};

Foxtrick.util.matchView.startLoad = function(container) {
	var doc = container.ownerDocument;
	var loading = Foxtrick.util.note.createLoading(doc);
	container.appendChild(loading);
};

Foxtrick.util.matchView.fillMatches = function(container, xml, errorText) {
	if (xml === null) {
		container.textContent = errorText;
		return;
	}

	var type2info = function(type) {
		// convert match type integer to match type info
		// source:
		// http://www.hattrick.org/Community/CHPP/Matches/CHPPMatches.aspx
		var mapping = {
			"1" : { key : "league", className : "matchLeague" },
			"2" : { key : "qualification", className : "matchQualification" },
			"3" : { key : "cup", className : "matchCup" },
			"4" : { key : "friendly", className : "matchFriendly" },
			"5" : { key : "friendly.cup", className : "matchFriendly" },
			"7" : { key : "masters", className : "matchMasters" },
			"8" : { key : "friendly", className : "matchFriendly" },
			"9" : { key : "friendly.cup", className : "matchFriendly" },
			"10" : { key : "nt.competitive", className : " matchLeague" },
			"11" : { key : "nt.competitive", className : " matchLeague" },
			"12" : { key : "nt.friendly", className : " matchFriendly" },
			"100" : { key : "youth.league", className : "matchLeague" },
			"101" : { key : "youth.friendly", className : "matchFriendly" },
			"103" : { key : "youth.friendly.cup", className : "matchFriendly" },
			"105" : { key : "youth.friendly", className : "matchFriendly" },
			"106" : { key : "youth.friendly.cup", className : "matchFriendly" },
		};
		var obj = mapping[type];
		if (obj) {
			return {
				str : Foxtrickl10n.getString("match.type." + obj.key),
				className : obj.className
			};
		}
		return null;
	};

	var doc = container.ownerDocument;

	container.textContent = ""; // clear container first
	var table = doc.createElement("table");
	container.appendChild(table);

	var teamId = xml.getElementsByTagName("TeamID")[0].textContent;
	var teamName = xml.getElementsByTagName("TeamName")[0].textContent;
	var isYouth = (xml.getElementsByTagName("IsYouth")[0].textContent == "True");
	var matches = xml.getElementsByTagName("Match");
	// add one played and one not played
	var played = Foxtrick.filter(function(n) {
		return n.getElementsByTagName("Status")[0].textContent == "FINISHED";
	}, matches);
	var notPlayed = Foxtrick.filter(function(n) {
		return n.getElementsByTagName("Status")[0].textContent != "FINISHED";
	}, matches);
	var toAdd = [];
	if (played.length > 0)
		toAdd.push(played[played.length - 1]);
	if (notPlayed.length > 0) {
		toAdd.push(notPlayed[0]);
		var nextmatchdate = notPlayed[0].getElementsByTagName("MatchDate")[0].textContent;
	}
	for (var i = 0; i < toAdd.length; ++i) {
		var match = toAdd[i];
		var dateText = match.getElementsByTagName("MatchDate")[0].textContent;
		var date = Foxtrick.util.time.getDateFromText(dateText, "yyyymmdd");
		var matchId = match.getElementsByTagName("MatchID")[0].textContent;
		var homeTeam = match.getElementsByTagName("HomeTeamName")[0].textContent;
		var awayTeam = match.getElementsByTagName("AwayTeamName")[0].textContent;
		var homeId = match.getElementsByTagName("HomeTeamID")[0].textContent;
		var awayId = match.getElementsByTagName("AwayTeamID")[0].textContent;
		var side = (teamId == homeId) ? "home" : "away";
		var type = match.getElementsByTagName("MatchType")[0].textContent;
		var typeInfo = type2info(type);
		var status = match.getElementsByTagName("Status")[0].textContent;
		if (status == "FINISHED") {
			var homeGoals = match.getElementsByTagName("HomeGoals")[0].textContent;
			var awayGoals = match.getElementsByTagName("AwayGoals")[0].textContent;
		}
		else {
			var homeGoals = null;
			var awayGoals = null;
		}

		var getMatchRow = function() {
			var rtl = Foxtrick.util.layout.isRtl(doc);

			var row = doc.createElement("tr");

			var matchTypeCell = doc.createElement("td");
			if (typeInfo) {
				var typeImg = doc.createElement("img");
				typeImg.src = "/Img/icons/transparent.gif";
				typeImg.className = typeInfo.className;
				typeImg.title = typeImg.alt = typeInfo.str;
				matchTypeCell.appendChild(typeImg);
			}
			row.appendChild(matchTypeCell);

			var matchCell = doc.createElement("td");
			var matchLink = doc.createElement("a");
			matchLink.href = "/Club/Matches/Match.aspx?matchID=" + matchId
				+ (isYouth ? "&isYouth=True" : "");
			// get in one line for standard theme while won't fit in one
			// line anyway for simple theme
			var cutlength = Foxtrick.util.layout.isStandard(doc) ? 12 : 18;
			if (!rtl) {
				matchLink.title = homeTeam + " - " + awayTeam;
				matchLink.innerHTML = "<span class='nowrap'>" + homeTeam.substr(0, cutlength) + "</span>" + " - "
					+ "<span class='nowrap'>" + awayTeam.substr(0, cutlength) + "</span>";
			}
			else {
				matchLink.title = awayTeam + " - " + homeTeam;
				matchLink.innerHTML = "<span class='nowrap'>" + awayTeam.substr(0, cutlength) + "</span>" + " - "
					+ "<span class='nowrap'>" + homeTeam.substr(0, cutlength) + "</span>";
			}
			matchCell.appendChild(matchLink);
			row.appendChild(matchCell);

			var resultCell = doc.createElement("td");
			if (homeGoals !== null && awayGoals !== null) {
				resultCell.textContent = homeGoals + " - " + awayGoals;
				homeGoals = Number(homeGoals);
				awayGoals = Number(awayGoals);
				if (homeGoals == awayGoals) {
					resultCell.className = "draw";
				}
				else if ((homeGoals > awayGoals && side == "home")
					|| (homeGoals < awayGoals && side == "away")) {
					resultCell.className = "won";
				}
				else {
					resultCell.className = "lost";
				}
			}
			else {
				// add HT-Live
				var liveLink = doc.createElement("a");
				liveLink.href = "/Club/Matches/Live.aspx?actionType=addMatch&"+ (isYouth ? "youth" : "") + "matchID=" + matchId;
				var liveImg = doc.createElement("img");
				liveImg.className = "matchHTLive";
				liveImg.src = "/Img/Icons/transparent.gif";
				liveImg.alt = liveImg.title = Foxtrickl10n.getString("htLive");
				liveLink.appendChild(liveImg);
				resultCell.appendChild(liveLink);
			}
			Foxtrick.addClass(resultCell, "nowrap");
			row.appendChild(resultCell);
			return row;
		};

		table.appendChild(getMatchRow());
	}
	return nextmatchdate;
};
