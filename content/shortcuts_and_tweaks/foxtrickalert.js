/**
 * foxtrickalert.js
 * give a growl notification on news ticker
 * @author taised
 */
////////////////////////////////////////////////////////////////////////////////
var FoxtrickAlert = {

    MODULE_NAME : "FoxtrickAlert",
    MODULE_CATEGORY : Foxtrick.moduleCategories.SHORTCUTS_AND_TWEAKS,
    DEFAULT_ENABLED : true,
    OPTIONS : new Array("NewMail"), 
	last_num_message:0,
    
    init : function() {
        Foxtrick.registerAllPagesHandler( FoxtrickAlert );
        Foxtrick.news[0] = null;
        Foxtrick.news[1] = null;
        Foxtrick.news[2] = null;
    },

    run : function( doc ) {
    	try { 
			
            Foxtrick.addJavaScript(doc, "chrome://foxtrick/content/resources/js/newsticker.js");
            doc.getElementById('ticker').addEventListener("FoxtrickTickerEvent", FoxtrickAlert.showAlert, false, true ) ;
            if (Foxtrick.isModuleFeatureEnabled( this, "NewMail" ) ) {
					doc.getElementById('menu').addEventListener("FoxtrickTickerEvent", FoxtrickAlert.showMailAlert, false, true ) ;       
			}
		} catch (e) {
            Foxtrick.LOG('FoxtrickAlert.js run: '+e);
        }
    },
	
	change : function( page, doc ) {
	
	},
	
    showMailAlert : function(evt)
    {   
		var message = evt.originalTarget.getElementsByTagName('a')[0].getElementsByTagName('span')[0];
		if (message) { 
				var num_message = parseInt(message.innerHTML.replace(/\(|\)/g,''));
				if (num_message > FoxtrickAlert.last_num_message) {
						
						var message = String(parseInt(num_message-FoxtrickAlert.last_num_message))+' '+Foxtrickl10n.getString( "foxtrick.newmailtoyou");
						if (FoxtrickPrefs.getBool("alertSlider")) {
							FoxtrickAlert.foxtrick_showAlert(message);
						}
						if (FoxtrickPrefs.getBool("alertSliderGrowl")) {
							FoxtrickAlert.foxtrick_showAlertGrowl(message);
						}
						if (FoxtrickPrefs.getBool("alertSound")) {
							try {
								Foxtrick.playSound(FoxtrickPrefs.getString("alertSoundUrl"));
							} catch (e) {
								Foxtrick.LOG('playsound: '+e);
							}
						}					
						FoxtrickAlert.last_num_message = num_message;
				}
			}
	},
	
    showAlert : function(evt)
    {   
		var tickerdiv=evt.originalTarget;
        tickerdiv=tickerdiv.getElementsByTagName('div');
        try {
            var message=null;
            var elemText=new Array();
            //getting text
            for (i=0;i<tickerdiv.length;i++)
            {
				var tickelem=tickerdiv[i].firstChild.firstChild;
                if (tickelem.nodeType!=tickelem.TEXT_NODE)
                {
                    //there is the strong tag
					elemText[i]=tickelem.firstChild.nodeValue;
                    message=tickelem.firstChild.nodeValue;
					var isequal=true;
					for (j=0;j<=i;j++)
					{
						if (elemText[j]!=Foxtrick.news[j])
							isequal=false;
						Foxtrick.news[j]=elemText[j];
                    }
                    if (!isequal) {
						if (FoxtrickPrefs.getBool("alertSlider")) {
							FoxtrickAlert.foxtrick_showAlert(message);
						}
						if (FoxtrickPrefs.getBool("alertSliderGrowl")) {
							FoxtrickAlert.foxtrick_showAlertGrowl(message);
						}
						if (FoxtrickPrefs.getBool("alertSound")) {
							try {
								Foxtrick.playSound(FoxtrickPrefs.getString("alertSoundUrl"));
							} catch (e) {
								Foxtrick.LOG('playsound: '+e);
							}
						}
					}
                } else {
					elemText[i]=tickelem.nodeValue;
				}
            } 
        } catch(e) { Foxtrick.LOG('error showalert '+e); }
    },

    foxtrick_showAlert: function(text, alertError) {
        var img = "http://hattrick.org/favicon.ico";
        var title = "Hattrick.org";
    	
        try{
            try {
                var alertsService = Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService);
                var clickable = true;
                var listener = { observe:
                    function(subject, topic, data) {
                        if (topic=="alertclickcallback") {
                            window.focus();
                        }
                    }
                };
                alertsService.showAlertNotification(img, title, text, clickable, "", listener);
            } catch (e) {
                // fix for when alerts-service is not available (e.g. SUSE)
                var alertWin = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
                    .getService(Components.interfaces.nsIWindowWatcher)
                    .openWindow(null, "chrome://global/content/alerts/alert.xul",
                                "_blank", "chrome,titlebar=no,popup=yes", null);
                alertWin.arguments = [img, title, text, false, ""];
                alertWin.setTimeout(function(){alertWin.close()},5000);
            }
        } catch (e) {
            Foxtrick.LOG(e);
        }
    },
    
    
    foxtrick_showAlertGrowl: function(text, alertError) {
    	// mac only
    	try {
    		var grn = Components.classes["@growl.info/notifications;1"].getService(Components.interfaces.grINotifications);
    		var img = "http://hattrick.org/favicon.ico";
    		var title = "Hattrick.org";
    		grn.sendNotification("Hattrick.org (Foxtrick)", img, title, text, "", null);
    	} catch (e) {
    		Foxtrick.LOG(e);
    	}
    }
};