'use strict';
/*
 * currency.js
 * Utilities for handling currency
 */

if (!Foxtrick) var Foxtrick = {};
if (!Foxtrick.util) Foxtrick.util = {};

Foxtrick.util.currency = {
	/**
	 * continue with correct currency
	 * @param	{document}	doc
	 * @param	{Function}	callback
	 */
	establish: function(doc, callback) {
		var ownTeamId = Foxtrick.util.id.getOwnTeamId();
		var rate = this.getRate(doc);
		var symbol = this.getSymbol(doc);
		if (!rate || !symbol || !this.isValidSymbol(symbol)) {
			if (!Foxtrick.util.layout.hasMultipleTeams(doc)) {
				Foxtrick.Prefs.setString('Currency.Rate.' + ownTeamId, this.findRate().toString());
				Foxtrick.Prefs.setString('Currency.Symbol.' + ownTeamId, this.findSymbol());
				callback();
				return;
			}

			var teamargs = [['file', 'teamdetails'], ['version', '2.9'], ['TeamId', ownTeamId]];
			Foxtrick.util.api.retrieve(doc, teamargs, { cache_lifetime: 'session'},
			  function(teamXml, errorText) {
				if (!teamXml || errorText) {
					Foxtrick.log('[ERROR] Currency detection failed:', errorText);
					return;
				}
				// set the correct currency
				var teams = teamXml.getElementsByTagName('IsPrimaryClub');
				var primaryTeamIdx = 0;
				for (; primaryTeamIdx < teams.length; ++primaryTeamIdx) {
					if (teams[primaryTeamIdx].textContent == 'True')
						break;
				}
				var leagueId = teamXml.getElementsByTagName('LeagueID')[primaryTeamIdx].textContent;
				Foxtrick.Prefs.setString('Currency.Rate.' + ownTeamId,
										Foxtrick.util.currency.findRate(leagueId).toString());
				Foxtrick.Prefs.setString('Currency.Symbol.' + ownTeamId,
										Foxtrick.util.currency.findSymbol(leagueId));
				callback();
			});
		}
		else
			callback();
	},
	getSymbolByCode: function(lookup) {
		var category = Foxtrick.XMLData.htCurrencyJSON.hattrickcurrencies;
		return Foxtrick.nth(function(item) {
			return item.code == lookup;
		}, category).symbol;
	},

	isValidSymbol: function(symbol) {
		var category = Foxtrick.XMLData.htCurrencyJSON.hattrickcurrencies;
		return Foxtrick.any(function(item) {
			return item.symbol == symbol;
		}, category);
	},

	getRateByCode: function(lookup) {
		var category = Foxtrick.XMLData.htCurrencyJSON.hattrickcurrencies;
		return parseFloat(Foxtrick.nth(function(item) {
			return item.code == lookup;
		}, category).eurorate);
	},
	/**
	 * get saved currency symbol
	 * use with Foxtrick.util.currency.establish!
	 * @param	{document}	doc
	 * @returns	{String}		Symbol
	 */
	getSymbol: function(doc) {
		return Foxtrick.Prefs.getString('Currency.Symbol.' + Foxtrick.Pages.All.getOwnTeamId(doc));
	},
	/**
	 * find currency symbol by leagueid
	 * @param	{Integer}	id	leagueid
	 * @returns	{String}		Symbol
	 */
	findSymbol: function(id) {
		var leagueId = id || Foxtrick.util.id.getOwnLeagueId();
		var name = Foxtrick.util.id.getLeagueDataFromId(leagueId).Country.CurrencyName;
		return name.replace(/000 /, '');
	},
	/**
	 * get saved ratio to euro (1 curr = x euro)
	 * use with Foxtrick.util.currency.establish!
	 * @param	{document}	doc
	 * @returns	{Number}	rate
	 */
	getRate: function(doc) {
		return parseFloat(Foxtrick.Prefs.getString('Currency.Rate.' +
												  Foxtrick.Pages.All.getOwnTeamId(doc)));
	},
	/**
	 * find currency rate by leagueid
	 * 1 curr = x euro
	 * @param	{Integer}	id	leagueid
	 * @returns	{Number}		rate
	 */
	findRate: function(id) {
		var leagueId = id || Foxtrick.util.id.getOwnLeagueId();
		var name = Foxtrick.XMLData.League[leagueId].Country.CurrencyName;
		var rate = Foxtrick.XMLData.League[leagueId].Country.CurrencyRate.replace(',', '.');
		var mag = (name.indexOf('000 ') > -1) ? 0.001 : 1;
		return parseFloat(rate) * mag / 10;
	}
};
