/**
 * loader.js
 * Foxtrick loader
 * @author  convincedd
 */

if (!Foxtrick) var Foxtrick={};

Foxtrick.StatsHash = {};

Foxtrick.Loader = function(){		
	var pub = {};	
	pub.Load = function(){	
		// create stats Hash for Foxtrick.LinkCollection
		for (var key in Foxtrick.LinkCollection.stats) {
			var stat = Foxtrick.LinkCollection.stats[key];
			for (var prop in stat) {
				if (prop.match(/link/)) {
					if (typeof(Foxtrick.StatsHash[prop]) == 'undefined') {
						Foxtrick.StatsHash[prop] = {};
					}
					Foxtrick.StatsHash[prop][key] = stat;
				}
			}
		}
	};
	return pub;	
}();



var setStyle = function(){
 try{ 
	// Set style at loading page
	document.getElementsByTagName('body')[0].style.display = 'none';
	console.log('hide body');
 } catch(e){Foxtrick.dump('setStyle: '+e)}
};


function runScript() { 
  try{
	console.log('run script');
	
// check if it's in exclude list
			for (var i in Foxtrick.pagesExcluded) {
				var excludeRe = new RegExp(Foxtrick.pagesExcluded[i], "i");
				// page excluded, return
				if (document.location.href.search(excludeRe) > -1) {
					return;
				}
			}

	var begin = new Date();
	Foxtrick.Loader.Load();	
	FoxtrickMain.init();
	Foxtrick.reload_module_css(document);
		var mid = new Date();
	FoxtrickMain.run(document);
		var end = new Date();
	
	
	var time = ( mid.getSeconds() - begin.getSeconds() ) * 1000
                 + mid.getMilliseconds() - begin.getMilliseconds();
	var log = "init time: " + time + " ms\n" ;		
	var time = ( end.getSeconds() - mid.getSeconds() ) * 1000
                 + end.getMilliseconds() - mid.getMilliseconds();
	log += "Foxtrick run time: " + time + " ms\n" ;		
	console.log( log );			
  } catch(e){console.log('runScript '+e)}
  	document.getElementsByTagName('body')[0].style.display='block';
}

// action
if (typeof(did_action)=='undefined'){
	//window.setTimeout(setStyle, 1);
	window.addEventListener("DOMContentLoaded", runScript, false);
	var did_action=true;
}

