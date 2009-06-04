/**
 * repositionedplayers.js
 * Foxtrick colors repositioned Players
 * @author spambot
 */

////////////////////////////////////////////////////////////////////////////////

var FoxtrickRepositionedPlayers = {

	MODULE_NAME : "RepositionedPlayers",
	MODULE_CATEGORY : Foxtrick.moduleCategories.MATCHES,
	DEFAULT_ENABLED : true,
    
    COLOR : "#ffa500",

    PLAYERIDS : new Array (
                            "ctl00_CPMain_ucKeeper_pnlbox",
                            "ctl00_CPMain_ucLeftBack_pnlbox",
                            "ctl00_CPMain_ucCentralDefender1_pnlbox",
                            "ctl00_CPMain_ucCentralDefender2_pnlbox",
                            "ctl00_CPMain_ucrightback_pnlbox",
                            "ctl00_CPMain_ucLeftwinger_pnlbox",
                            "ctl00_CPMain_ucInnerMidfield1_pnlbox",
                            "ctl00_CPMain_ucInnerMidfield2_pnlbox",
                            "ctl00_CPMain_ucrightwinger_pnlbox",
                            "ctl00_CPMain_ucForward1_pnlbox",
                            "ctl00_CPMain_ucForward2_pnlbox"
                          ),
                          
    PLAYERDESC : new Array (
                            "Keeper",
                            "LeftBack",
                            "CentralDefender",
                            "CentralDefender",
                            "RightBack",
                            "Leftwinger",
                            "InnerMidfield",
                            "InnerMidfield",
                            "Rightwinger",
                            "Forward",
                            "Forward"
                          ),                          

	init : function() {
			Foxtrick.registerPageHandler( 'matchLineup',
                                          FoxtrickRepositionedPlayers );
    },

    run : function( page, doc ) {
                
                var playerdivs = Foxtrick.getElementsByClass( "position", doc );
				var playerbox = Foxtrick.getElementsByClass( "box_lineup", doc );

				var useCode=Foxtrickl10n.isStringAvailableLocal( 'foxtrick.matches.Keeper' );
				dump ('FoxtrickRepositionedPlayers->locale available: ' + useCode + '\n');
    
                for (var i = 0; i < playerdivs.length; i++) {
                    var player_id = playerdivs[i].parentNode.id;
                    var player_pos = Foxtrick.trim(playerdivs[i].innerHTML);
					var player_ypos = playerbox[i]["style"]["top"].replace('px','');
					var player_xpos = playerbox[i]["style"]["left"].replace('px','');
					//dump('#' + i + ': ' + player_xpos + ' - ' + player_ypos + '\n');
                    //dump('#' + i + ': ' + player_pos + ' - ' + player_id + '\n');
                    switch ( player_id ) {
                        case this.PLAYERIDS[0]:
                            if (useCode && player_pos != Foxtrickl10n.getString('foxtrick.matches.Keeper'))
                                this._colorize( playerdivs[i], this.PLAYERDESC[i] )
							else 
                            break;
                        case this.PLAYERIDS[1]:
                            if ( (useCode && player_pos != Foxtrickl10n.getString('foxtrick.matches.LeftBack'))
								|| (!useCode && (player_ypos<72-20||player_ypos>72+20
								|| (player_xpos!=480&&player_xpos!=464))))
                                this._colorize( playerdivs[i], this.PLAYERDESC[i] )
                            else
                            break;
                        case this.PLAYERIDS[2]:
                            if ( (useCode && player_pos != Foxtrickl10n.getString('foxtrick.matches.CentralDefender'))
								|| (!useCode && (player_ypos<72-20||player_ypos>72+20)))
                                this._colorize( playerdivs[i], this.PLAYERDESC[i] )
                            else
                            break;
                        case this.PLAYERIDS[3]:
                            if ( (useCode && player_pos != Foxtrickl10n.getString('foxtrick.matches.CentralDefender'))
								|| (!useCode && (player_ypos<72-20||player_ypos>72+20)))
                                this._colorize( playerdivs[i], this.PLAYERDESC[i] )
                            else
                            break;
                        case this.PLAYERIDS[4]:
                            if ((useCode && player_pos != Foxtrickl10n.getString('foxtrick.matches.RightBack'))
								|| (!useCode && (player_ypos<72-20||player_ypos>72+20 
								|| (player_xpos!=30&&player_xpos!=46))))
                                this._colorize( playerdivs[i], this.PLAYERDESC[i] )
                            else
                            break;
                        case this.PLAYERIDS[5]:
                            if ( (useCode && player_pos != Foxtrickl10n.getString('foxtrick.matches.Leftwinger'))
								|| (!useCode &&  (player_ypos<141-20||player_ypos>141+20
								|| (player_xpos!=480&&player_xpos!=464))))
                                this._colorize( playerdivs[i], this.PLAYERDESC[i] )
                            else
                            break;
                        case this.PLAYERIDS[6]:
                            if ((useCode && player_pos != Foxtrickl10n.getString('foxtrick.matches.InnerMidfield'))
								|| (!useCode &&  (player_ypos<141-20||player_ypos>141+20)))
                                this._colorize( playerdivs[i], this.PLAYERDESC[i] )
                            else
                            break;
                        case this.PLAYERIDS[7]:
                            if ((useCode && player_pos!= Foxtrickl10n.getString('foxtrick.matches.InnerMidfield'))
								|| (!useCode &&  (player_ypos<141-20||player_ypos>141+20)))
                                this._colorize( playerdivs[i], this.PLAYERDESC[i] )
                            else
                            break;
                        case this.PLAYERIDS[8]:
                            if ((useCode && player_pos!= Foxtrickl10n.getString('foxtrick.matches.Rightwinger'))
								|| (!useCode &&  (player_ypos<141-20||player_ypos>141+20
								|| (player_xpos!=30&&player_xpos!=46))))
                                this._colorize( playerdivs[i], this.PLAYERDESC[i] )
                            else
                            break;
                        case this.PLAYERIDS[9]:
                            if ((useCode && player_pos != Foxtrickl10n.getString('foxtrick.matches.Forward'))
								|| (!useCode &&  (player_ypos<210-20||player_ypos>210+20)))
                                this._colorize( playerdivs[i], this.PLAYERDESC[i] )
                            else
                            break;
                            break;
                        case this.PLAYERIDS[10]:
                            if ((useCode && player_pos != Foxtrickl10n.getString('foxtrick.matches.Forward'))
								|| (!useCode &&  (player_ypos<210-20||player_ypos>210+20)))
                                this._colorize( playerdivs[i], this.PLAYERDESC[i] )
                            else
                            break;
                    }
                }
	},

	change : function( page, doc ) {

	},
        
    _colorize : function ( elm , playerdesc ) {
        elm.setAttribute( "style", "color :" + this.COLOR );
        if (Foxtrickl10n.isStringAvailableLocal('foxtrick.matches.'+ playerdesc ))
            elm.setAttribute( "title",
                ( 
                    Foxtrickl10n.getString('foxtrick.matches.RepositionedPlayers.titel')  + ' (' + 
                    Foxtrickl10n.getString('foxtrick.matches.'+ playerdesc ) + ')'
                )
            );
    }
        
};