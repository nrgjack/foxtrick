/**
 * Foxtrick - an extension for hattrick.org
 * Contact us: by HT-mail to Mod-PaV on hattrick.org
 */
////////////////////////////////////////////////////////////////////////////////
/** Modules that are to be called every time any hattrick page loads.
 * Should implement a run() method.
 * DON'T EDIT THIS, use registerAllPagesHandler() instead.
 */
Foxtrick.run_every_page = [];

/** Modules that are to be called on specific hattrick page loads.
 * Should implement a run() method.
 * DON'T EDIT THIS, use registerPageHandler() instead.
 */
Foxtrick.run_on_page = [];

/** Core Foxtrick modules, always used.
 * Don't add here unless you have a good reason to. */
Foxtrick.core_modules = [ FoxtrickPrefs,
                          Foxtrickl10n ];
////////////////////////////////////////////////////////////////////////////////
var FoxtrickMain = {

    init : function() {
        var i;

        // init core modules
        for ( i in Foxtrick.core_modules ) {
            Foxtrick.core_modules[i].init();
        }

        // create handler arrays for each recognized page
        for ( i in Foxtrick.ht_pages ) {
            Foxtrick.run_on_page[i] = new Array();
        }

        // init all modules
        for ( i in Foxtrick.modules ) {
            var module = Foxtrick.modules[i];
            // if module has an init() function and is enabled
            if ( module.MODULE_NAME
                    && Foxtrick.isModuleEnabled( module )
                    && module.init )
            {
                try {
                    module.init();
                    dump( "Foxtrick enabled module: " + module.MODULE_NAME + "\n");
                } catch (e) {
                    dump( "Foxtrick module " + module.MODULE_NAME + " init() exception: " + "\n  " + e + "\n");
                    Components.utils.reportError(e);
                }
            }
            else
                dump( "Foxtrick disabled module: " + module.MODULE_NAME + "\n" );
        }

    },
   
    registerOnPageLoad : function(document) {
         // listen to page loads
        var appcontent = document.getElementById( "appcontent" );
        if ( appcontent) 
            appcontent.addEventListener( "DOMContentLoaded", this.onPageLoad,
                                         true );
    },
    
    onPageLoad : function( ev ) {
        var doc = ev.originalTarget;

        if ( doc.nodeName != "#document" )
            return;

        
        // hattrick URL check and run if on HT
        if ( Foxtrick.getHref( doc ).search( FoxtrickPrefs.getString( "HTURL" ) ) > -1 )
        {
            var begin = new Date();

            FoxtrickMain.run( doc );

            var end = new Date();
            var time = ( end.getSeconds() - begin.getSeconds() ) * 1000
                     + end.getMilliseconds() - begin.getMilliseconds();
            dump( "Foxtrick run time: " + time + " ms\n" );
        }
    },

    // main entry run on every ht page load
    run : function( doc ) {
        // call the modules that want to be run() on every hattrick page
        Foxtrick.run_every_page.forEach(
            function( fn ) {
                try {
                    fn.run( doc );
                } catch (e) {
                    dump ( "Foxtrick module " + fn.MODULE_NAME + " run() exception: \n  " + e + "\n" );
                    Components.utils.reportError(e);
                }
            } );

        // call all modules that registered as page listeners
        // if their page is loaded
        
        // find current page index/name and run all handlers for this page
        for ( var i in Foxtrick.ht_pages )
        {
            if ( Foxtrick.isPage( Foxtrick.ht_pages[i], doc ) )
            {
                // on a specific page, run all handlers
                Foxtrick.run_on_page[i].forEach(
                    function( fn ) {
                        try {
                            fn.run( i, doc );
                        } catch (e) {
                            dump ( "Foxtrick module " + fn.MODULE_NAME + " run() exception at page " + i + "\n  " + e + "\n" );
                            Components.utils.reportError(e);
                        }
                    } );
            }
        }

    },

};

Foxtrick.isPage = function( page, doc ) {
	var htpage_regexp = new RegExp( page, "i" );
	var stage_regexp = /http:\/\/stage\.hattrick\.org/i;
	dump(htpage_regexp);
	if(!( FoxtrickPrefs.getBool("disableOnStage") &&
		Foxtrick.getHref( doc).search( stage_regexp ) > -1)) {
		return Foxtrick.getHref( doc ).search( htpage_regexp ) > -1;
	} else { 
		return false;
	}
}

Foxtrick.getHref = function( doc ) {
    return doc.location.href;
}

/**
 * Register with this method to have your module's run()
 * function called on specific pages (names can be found
 * in Foxtrick.ht_pages in module.js.
 * Your function should accept two arguments:
 * the page name (from ht_pages) and current document.
 */
Foxtrick.registerPageHandler = function( page, who ) {

    // if is enabled in preferences and has a run() function
    if ( who.run ) {
        Foxtrick.run_on_page[page].push( who );
    }
}

/**
 * Register with this method to have your module's run() function
 * called every time any hattrick page is loaded.
 * Please use registerPageHandler() if you need only to run
 * on specific pages.
 * Your run() function will be called with only one argument,
 * the current document.
 */
Foxtrick.registerAllPagesHandler = function( who ) {
    if ( who.run )
    {
        Foxtrick.run_every_page.push( who );
    }
}

/** Remove any occurences of tags ( "<something>" ) from text */
Foxtrick.stripHTML = function( text ) {
    return text.replace( /(<([^>]+)>)/ig,"");
}

/** Insert text in given textarea at the current position of the cursor */
Foxtrick.insertAtCursor = function( textarea, text ) {
    textarea.value = textarea.value.substring( 0, textarea.selectionStart )
                   + text
                   + textarea.value.substring( textarea.selectionEnd, textarea.value.length );
}

Foxtrick.addStyleSheet = function( doc, css ) {
	var path = "head[1]";
	var head = doc.evaluate(path,doc.documentElement,null,doc.DOCUMENT_NODE,null).singleNodeValue;
	
	var link = doc.createElement("link");
	link.setAttribute("rel", "stylesheet");
	link.setAttribute("type", "text/css");
	link.setAttribute("media", "all");
	link.setAttribute("href", css);
	head.appendChild(link);
}

// attaches a JavaScript file to the page
Foxtrick.addJavaScript = function( doc, js ) {
	var path = "head[1]";
	var head = doc.evaluate(path,doc.documentElement,null,doc.DOCUMENT_NODE,null).singleNodeValue;
	
  var script = doc.createElement("script");
  script.setAttribute("language", "JavaScript");
  script.setAttribute("src", js);
  head.appendChild(script);
}

// attaches a JavaScript snippet to the page
Foxtrick.addJavaScriptSnippet = function( doc, code ) {
  var path = "head[1]";
	var head = doc.evaluate(path,doc.documentElement,null,doc.DOCUMENT_NODE,null).singleNodeValue;
    
  var script = doc.createElement("script");
  script.setAttribute("language", "JavaScript");
  script.innerHTML=code;
  head.appendChild(script);
}

Foxtrick.confirmDialog = function(msg) {
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                        .getService(Components.interfaces.nsIPromptService);
    return promptService.confirm(null, null, msg);
}

Foxtrick.alert = function( msg ) {
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                        .getService(Components.interfaces.nsIPromptService);
    return promptService.alert(null, null, msg);
}

Foxtrick.trim = function (text) {
  return text.replace(/^\s+/, "").replace(/\s+$/, '');
}

String.prototype.group = function( chr, size )
{
	if ( typeof chr == 'undefined' ) chr = ",";
	if ( typeof size == 'undefined' ) size = 3;
	return this.split( '' ).reverse().join( '' ).replace( new RegExp( "(.{" + size + "})(?!$)", "g" ), "$1" + chr ).split( '' ).reverse().join( '' );
}

Foxtrick.isModuleEnabled = function( module ) {
    try {
        var val = FoxtrickPrefs.getBool( "module." + module.MODULE_NAME + ".enabled" );
        return (val != null) ? val : module.DEFAULT_ENABLED; 
    } catch( e ) {
        return false;
    }
}

Foxtrick.LOG = function (msg) {
        var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                                 .getService(Components.interfaces.nsIConsoleService);
        consoleService.logStringMessage(msg);
}

Foxtrick.selectFile = function (parentWindow) {
    try {
    	var fp = Components.classes['@mozilla.org/filepicker;1'].createInstance(Components.interfaces.nsIFilePicker);
    	fp.init(parentWindow, "", fp.modeOpen);
    	if (fp.show() == fp.returnOK ) {
    		return fp.file.path;
    	}
    	return null;
    } catch (e) {
        dump(e);
    }
}

Foxtrick.playSound = function(url) {
  try {
    var soundService = Components.classes["@mozilla.org/sound;1"].getService(Components.interfaces.nsISound);
    var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
    soundService.play(ioService.newURI(url, null, null));
  } catch (e) {
    dump(e);
  }
}