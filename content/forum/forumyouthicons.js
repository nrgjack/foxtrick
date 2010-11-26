/**
 * forumyouthicons.js
 * Foxtrick forum post youth icons
 * @author spambot
 */

 var FoxtrickForumYouthIcons = {

	MODULE_NAME : "ForumYouthIcons",
	MODULE_AUTHOR : "spambot",
	MODULE_CATEGORY : Foxtrick.moduleCategories.FORUM,
	PAGES : new Array("forumWritePost","messageWritePost","guestbook","announcements","forumSettings","newsletter","forumModWritePost","ticket"),
	OPTIONS :  new Array("q", "user_id", "kit_id", "article_id", "line_br", "clock", "spoiler", "pre", "table", "youth_player", "youth_team", "youth_match", "youth_series", "enlarge_input"),

	NEW_AFTER_VERSION: "0.5.2.1",
	LATEST_CHANGE:"Added table button",
	LATEST_CHANGE_CATEGORY : Foxtrick.latestChangeCategories.FIX,

	fields : [
				// Forum
				{ page:"forumWritePost", textarea : "ctl00_ctl00_CPContent_CPMain_ucHattrickMLEditor_txtBody", counterfield : "ctl00_ctl00_CPContent_CPMain_ucHattrickMLEditor_txtRemLen", length : 3900, add_quote:false },
				// ForumMOD
				{ page:"forumModWritePost", textarea : "ctl00_ctl00_CPContent_CPMain_ucHattrickMLEditor_txtBody", counterfield : "ctl00_ctl00_CPContent_CPMain_ucHattrickMLEditor_txtRemLen", length : 3900, add_quote:false },
				// mail
				{ page:"messageWritePost", textarea : "ctl00_CPMain_ucEditorMain_txtBody", counterfield : "ctl00_CPMain_ucEditorMain_txtRemLen", length : 1000, add_quote:false },
				// newsletter
				{ page:"newsletter", textarea : "ctl00_CPMain_tbNewsBody", counterfield : "ctl00_CPMain_txtCharsLeft", length : 1000, add_quote:false },
				// GB
				{ page:"guestbook", textarea : "ctl00_CPMain_ucHattrickMLEditor_txtBody", counterfield : "ctl00_CPMain_ucHattrickMLEditor_txtRemLen", length : 300, add_quote:false },
				// PA
				{ page:"announcements", textarea : "ctl00_CPMain_ucHattrickMLEditor_txtBody", counterfield : "ctl00_CPMain_ucHattrickMLEditor_txtRemLen", length : 1000, add_quote:true },
				// ticket
				{ page:"ticket", textarea : "ctl00_CPMain_ucActionEditor_txtBody", counterfield : "ctl00_CPMain_ucActionEditor_txtRemLen", length : 2950, add_quote:false },
				// HT-Press Editor
				//{ page:"unknown", textarea : "ctl00_CPMain_txtComment", counterfield : "ctl00_CPMain_txtCharsLeft3", length : 1800, add_quote:false },
				// signatur
				{ page:"forumSettings", textarea : "ctl00_CPMain_ucHattrickMLEditor_txtBody", counterfield : "ctl00_CPMain_ucHattrickMLEditor_txtRemLen", length : 500, add_quote:false },
			],

	icons : [
				{ type:"q", 		class : "ft_q", 	image : "format_q.png", 		string : "q", 		tags : "[q]qqq[/q]", 			replace_text: "qqq",	alt: "f_quote2" },
				{ type:"line_br", 	class : "ft_br", 	image : "format_br.png", 		string : "br",		tags : "[br]",		 			},
				{ type:"user_id", 	class : "ft_uid", 	image : "format_user.png", 		string : "user", 	tags : "[userid=xxx]",  		replace_text: "xxx"		},
				{ type:"kit_id", 	class : "ft_kit", 	image : "format_kit.png", 		string : "kit",		tags : "[kitid=xxx]",  			replace_text: "xxx"		},
				{ type:"article_id",class : "ft_aid", 	image : "format_article.png", 	string : "article",	tags : "[articleid=xxx]", 		replace_text: "xxx"		},
				{ type:"clock", 	class : "ft_clock", image : "format_clock.png", 	string : "clock", 	tags : "time",  				replace_text: "time"	},
				{ type:"spoiler", 	class : "ft_spoiler",image : "format_spoiler.png",	string : "spoiler",	tags : "[spoiler]yyy[/spoiler]",replace_text: "yyy"		},
				{ type:"pre", 		class : "ft_pre", 	image : "format_pre.png", 		string : "pre", 	tags : "[pre]zzz[/pre]", 		replace_text: "zzz"		},
				{ type:"table", 	class : "ft_table", image : "format_table.png", 	string : "table", 	tags : "[table][tr][td]ttt[/td][/tr][/table]", replace_text: "ttt",  versions:[' ', 'TAB','custom'], versions_string:'tableSeparator'},
			],

	youthicons : [
				{ type:"youth_player", 	class : "f_player", string : "youthplayerid", 	tags : "[youthplayerid=xxx]",  	replace_text: "xxx"	},
				{ type:"youth_team", 	class : "f_team", 	string : "youthteamid",		tags : "[youthteamid=xxx]",  	replace_text: "xxx"	},
				{ type:"youth_match", 	class : "f_match", 	string : "youthmatchid", 	tags : "[youthmatchid=xxx]",  	replace_text: "xxx"	},
				{ type:"youth_series", 	class : "f_series", string : "youthseries",		tags : "[youthleagueid=xxx]",  	replace_text: "xxx"	},
			],

	run : function( page, doc ) {
		var show_main = false; var show_youth = false;
		var enlarge = Foxtrick.isModuleFeatureEnabled(FoxtrickForumYouthIcons, "enlarge_input");
		if ((Foxtrick.isModuleFeatureEnabled(FoxtrickForumYouthIcons, "user_id")) ||
			(Foxtrick.isModuleFeatureEnabled(FoxtrickForumYouthIcons, "kit_id")) ||
			(Foxtrick.isModuleFeatureEnabled(FoxtrickForumYouthIcons, "article_id")) ||
			(Foxtrick.isModuleFeatureEnabled(FoxtrickForumYouthIcons, "line_br")) ||
			(Foxtrick.isModuleFeatureEnabled(FoxtrickForumYouthIcons, "clock")) ||
			(Foxtrick.isModuleFeatureEnabled(FoxtrickForumYouthIcons, "spoiler"))
			)
			show_main = true;
		if ((Foxtrick.isModuleFeatureEnabled(FoxtrickForumYouthIcons, "youth_player")) ||
			(Foxtrick.isModuleFeatureEnabled(FoxtrickForumYouthIcons, "youth_team")) ||
			(Foxtrick.isModuleFeatureEnabled(FoxtrickForumYouthIcons, "youth_match")) ||
			(Foxtrick.isModuleFeatureEnabled(FoxtrickForumYouthIcons, "youth_series")))
			show_youth = true;

		var div = doc.getElementById( "ft_youth_icons");
		if (div != null) return;
		var textarea = doc.getElementsByTagName('textarea')[0]
		if (textarea == null ) return;

		Foxtrick.addJavaScript(doc, Foxtrick.ResourcePath+"resources/js/HattrickML.js");

		if (doc.getElementById('ctl00_CPMain_tbNewsBody') != null) page = 'mailnewsletter';
		// Foxtrick.dump('YOUTH => ' + page +'\n');

		if (page == 'newsletter' || page == 'mailnewsletter') {
			if (page == 'newsletter' ) var textbox = 'ctl00_CPMain_txtMessage';
			if (page == 'mailnewsletter' ) var textbox = 'ctl00_CPMain_tbNewsBody';

			var anchor = doc.getElementById(textbox);

			if (page == 'newsletter') {
				var count = "ctl00_CPMain_txtCharsLeft";
				var chars = 1000;
				if (enlarge) {
					anchor.setAttribute('rows','20');
					anchor.setAttribute('cols','50');
				}
			}
			if (page == 'mailnewsletter') {
				var counter = doc.getElementsByName('remlennews')[0];
				counter.id = "ctl00_CPMain_txtCharsLeft";
				var count = "ctl00_CPMain_txtCharsLeft";
				var chars = 1000;
				{
					anchor.setAttribute('rows','20');
					anchor.setAttribute('cols','50');
				}
			}

			var div = doc.createElement('div');
			div.setAttribute('class','HTMLToolbar');
			div.setAttribute('style','display:block;width:300px;');
			div.innerHTML="<img style=\"margin: 2px;\" onclick=\"insertQuote(document.getElementById('" + textbox + "'), document.getElementById('" + count + "'), " + chars + ");\" src=\"/Img/Icons/transparent.gif\" class=\"f_quote2\" title=\"[q]\"><img style=\"margin: 2px;\" onclick=\"insertBold(document.getElementById('" + textbox + "'), document.getElementById('" + count + "'), " + chars + ");\" src=\"/Img/Icons/transparent.gif\" class=\"f_bold\" title=\"[b]\"><img style=\"margin: 2px;\" onclick=\"insertItalic(document.getElementById('" + textbox + "'), document.getElementById('" + count + "'), " + chars + ");\" src=\"/Img/Icons/transparent.gif\" class=\"f_italic\" title=\"[i]\"><img style=\"margin: 2px; width: 22px; height: 22px;\" onclick=\"insertUnderline(document.getElementById('" + textbox + "'), document.getElementById('" + count + "'), " + chars + ");\" src=\"/Img/Icons/transparent.gif\" class=\"f_ul\" title=\"[u]\"><img style=\"width: 22px; height: 22px;\" onclick=\"insertRuler(document.getElementById('" + textbox + "'), document.getElementById('" + count + "'), " + chars + ");\" src=\"/Img/Icons/transparent.gif\" class=\"f_hr\" title=\"[hr]\"><img onclick=\"insertPlayerID(document.getElementById('" + textbox + "'), document.getElementById('" + count + "'), " + chars + ");\" src=\"/Img/Icons/transparent.gif\" class=\"f_player\" title=\"[playerID=xxx]\"><img onclick=\"insertTeamID(document.getElementById('" + textbox + "'), document.getElementById('" + count + "'), " + chars + ");\" src=\"/Img/Icons/transparent.gif\" class=\"f_team\" title=\"[teamID=xxx]\"><img onclick=\"insertMatchID(document.getElementById('" + textbox + "'), document.getElementById('" + count + "'), " + chars + ");\" src=\"/Img/Icons/transparent.gif\" class=\"f_match\" title=\"[matchID=xxx]\"><img onclick=\"insertFederationID(document.getElementById('" + textbox + "'), document.getElementById('" + count + "'), " + chars + ");\" src=\"/Img/Icons/transparent.gif\" class=\"f_fed\" title=\"[fedID=xxx]\"><img onclick=\"insertMessage(document.getElementById('" + textbox + "'), document.getElementById('" + count + "'), " + chars + ");\" src=\"/Img/Icons/transparent.gif\" class=\"f_message\" title=\"[post=xxx.yy]\"><img onclick=\"insertLeagueID(document.getElementById('" + textbox + "'), document.getElementById('" + count + "'), " + chars + ");\" src=\"/Img/Icons/transparent.gif\" class=\"f_series\" title=\"[leagueID=xxx]\"><img onclick=\"insertLink(document.getElementById('" + textbox + "'), document.getElementById('" + count + "'), " + chars + ");\" src=\"/Img/Icons/transparent.gif\" class=\"f_www\" title=\"[link=xxx]\">";
			anchor.parentNode.insertBefore( div, anchor );
		}

		if (page == 'forumWritePost' && enlarge) {
				//var anchor = doc.getElementById('ctl00_CPMain_ucHattrickMLEditor_txtBody');
				var anchor = doc.getElementById('mainBody').getElementsByTagName('textarea')[0];
				anchor.style.height = '300px';
		}

		if (page == 'forumModWritePost' && enlarge) {
				//var anchor = doc.getElementById('ctl00_CPMain_ucHattrickMLEditor_txtBody');
				var anchor = doc.getElementById('mainBody').getElementsByTagName('textarea')[0];
				anchor.style.height = '300px';
		}

		if (page == 'announcements' && enlarge) {
				var anchor = doc.getElementById('ctl00_CPMain_ucHattrickMLEditor_txtBody');
				anchor.style.height = '300px';
		}
		var toolbar = doc.getElementsByClassName("HTMLToolbar")[0];
		if  (( toolbar == null ) && (!page == 'ads' )) return;
		var toolbar_main = toolbar;


		if ( (page == 'messageWritePost' ) && ( !Foxtrick.isStandardLayout( doc ) ) )
			try {
				var mainbbox = doc.getElementsByClassName("mainBox")[0];
				mainbbox.setAttribute( "style", "padding-bottom:25px;");
			}
			catch (e)
			{
				Foxtrick.dump('YouthIcons: mainBox not found ' + e + '\n');
			}

		toolbar.setAttribute("style","float:left; margin-right:3px;");

		if (page == 'guestbook')
			try {
				var textbox = doc.getElementById( "ctl00_CPMain_ucHattrickMLEditor_txtBody" );
				textbox.setAttribute('style' , 'height:100px; width:100%');
			}
			catch (e)
			{
				Foxtrick.dump('YouthIcons: textbox not found ' + e + '\n');
			}

		// Set styles of all buttons
		var nextElement = toolbar.firstChild;
		while (nextElement) {
			try {
				if ( nextElement.id == 'ctl00_CPMain_ucHattrickMLEditor_pnlTags' ||
					 nextElement.id == 'ctl00_CPMain_ucActionEditor_pnlTags' ||
					 nextElement.id == 'ctl00_CPMain_ucEditorMain_pnlTags' ||
					 nextElement.id.search('ctl00_ctl00_CPContent_CPMain_uc') != -1 ||
					 nextElement.href != null
				   ) {
						nextElement.setAttribute("style","display:none")
				}
				else {
					nextElement.setAttribute("style","margin:2px");
				}
				nextElement = nextElement.nextSibling;
			} catch(e) { nextElement = nextElement.nextSibling; }
		}


		//simple test if new icons are set up by HTs
		var toolbar_test = doc.getElementsByClassName("f_hr");
		if (toolbar_test.length > 0) {
			var target=toolbar.lastChild;
			var tooldivs = doc.getElementsByTagName('img');
			for (var i = 0; i < tooldivs.length; i++) {
				if (tooldivs[i].className=="f_ul") { target=tooldivs[i]; break;}
			}
			target=target.nextSibling;

			// add quote tag
			if (Foxtrick.isModuleFeatureEnabled(FoxtrickForumYouthIcons, this.icons[0].type)) {
				for (var j = 0; j < this.fields.length; j++) {
					var page = FoxtrickForumYouthIcons.fields[j].page;
					if (Foxtrick.isPage(Foxtrick.ht_pages[page], doc) && FoxtrickForumYouthIcons.fields[j].add_quote==true) {
						var newimage = doc.createElement( "img" );
						newimage.src = "/Img/Icons/transparent.gif";
						newimage.addEventListener( "click", this.addTagsClick, false);
						newimage.setAttribute( "tags", this.icons[0].tags );
						if ( this.icons[0].replace_text) newimage.setAttribute( "replace_text", this.icons[0].replace_text);
						newimage.setAttribute( "class", this.icons[0].class);
						newimage.setAttribute("style","margin:2px; width:22px; height:22px; cursor:pointer; background-image: url('"+Foxtrick.ResourcePath+"resources/img/ht-ml/"+this.icons[0].image+"') !important;");
						newimage.title = Foxtrickl10n.getString("ForumSpecialBBCode."+this.icons[0].string);
						toolbar.insertBefore( newimage, toolbar.getElementsByTagName('img')[0] );
					}
				}
			}
			for (var i = 1; i < this.icons.length; i++) {
				if (Foxtrick.isModuleFeatureEnabled(FoxtrickForumYouthIcons, this.icons[i].type)) {
					if (this.icons[i].alt==null || doc.getElementsByClassName(this.icons[i].alt).length==0) {
						var newimage = doc.createElement( "img" );
						newimage.src = "/Img/Icons/transparent.gif";
						newimage.addEventListener( "click", this.addTagsClick, false );
						newimage.setAttribute( "tags", this.icons[i].tags);
						if ( this.icons[i].replace_text) newimage.setAttribute( "replace_text", this.icons[i].replace_text);
						newimage.setAttribute( "class", this.icons[i].class);
						newimage.setAttribute("style","margin:2px; width:22px; height:22px; cursor:pointer; background-image: url('"+Foxtrick.ResourcePath+"resources/img/ht-ml/"+this.icons[i].image+"') !important;");
						newimage.title = Foxtrickl10n.getString("ForumSpecialBBCode."+this.icons[i].string);

						if (this.icons[i].versions) {
							var span = doc.createElement("span");
							span.className = "ft-pop-up-span-icon";
							span.appendChild(newimage);

							var list = doc.createElement("ul");
							list.className = "ft-pop";
							for (var j=0; j<this.icons[i].versions.length; ++j) {
								var item = doc.createElement("li");
								var link = doc.createElement("span");
								link.addEventListener("click", this.addTagsClick, false);
								link.setAttribute( "tags", this.icons[i].tags);
								if ( this.icons[i].replace_text) link.setAttribute( "replace_text", this.icons[i].replace_text);
								link.setAttribute('version', this.icons[i].versions[j]);
								link.textContent = Foxtrickl10n.getString('ForumSpecialBBCode.'+this.icons[i].versions_string).replace(/%s/, this.icons[i].versions[j]);
								link.setAttribute('parent_id', this.icons[i].class+'_id');
								link.setAttribute('version_string', this.icons[i].versions_string);
								item.appendChild(link);
								list.appendChild(item);
							}
							newimage.setAttribute('title_raw', newimage.title);
							newimage.title = newimage.title.replace(/%s/, FoxtrickPrefs.getString(this.icons[i].versions_string));
							newimage.setAttribute('id', this.icons[i].class+'_id');
							newimage.setAttribute('parent_id', this.icons[i].class+'_id');
							newimage.setAttribute('version', FoxtrickPrefs.getString(this.icons[i].versions_string));
							newimage.setAttribute('version_string', this.icons[i].versions_string);

							span.appendChild(list);
							toolbar.insertBefore(span,target);
						}
						else toolbar.insertBefore( newimage,target );
					}
				}
			}
		}

		var toolbar_label = doc.createElement( "div" );
		toolbar_label.innerHTML = Foxtrickl10n.getString("ForumYouthIcons.labelToolbar");
		toolbar_label.setAttribute( "style" , "background-color:#D0D0D0;;margin-bottom:3px;text-align:center;");
		toolbar.insertBefore( toolbar_label, toolbar.firstChild );

		// Set styles of next siblings
		var nextElement = toolbar.nextSibling;
		while (nextElement) {
			try {
				if (nextElement.id.search('ctl00_') == -1) {
					nextElement.setAttribute("style","clear:both;");
				}
				nextElement = nextElement.nextSibling;
			} catch(e) { nextElement = nextElement.nextSibling; }
		}

		if (show_youth || true) {
			var youthbar = doc.createElement( "div" );
			youthbar.setAttribute( "class" , "HTMLToolbar");
			youthbar.setAttribute( "style" , "float:left;");

			var youthbar_label = doc.createElement( "div" );
			youthbar_label.id = "ft_youth_icons";
			youthbar_label.innerHTML = Foxtrickl10n.getString("ForumYouthIcons.label");
			youthbar_label.setAttribute( "style" , "background-color:#D0D0D0;;margin-bottom:3px;text-align:center;");
			if (!show_youth) youthbar_label.setAttribute( "style" , "display:none;");
			youthbar.appendChild( youthbar_label);

			for (var i = 0; i < this.youthicons.length; i++) {
				if (Foxtrick.isModuleFeatureEnabled(FoxtrickForumYouthIcons, this.youthicons[i].type)) {
						var newimage = doc.createElement( "img" );
						newimage.src = "/Img/Icons/transparent.gif";
						newimage.addEventListener( "click", this.addTagsClick, false );
						newimage.setAttribute( "tags", this.youthicons[i].tags);
						if ( this.youthicons[i].replace_text) newimage.setAttribute( "replace_text", this.youthicons[i].replace_text);
						newimage.setAttribute( "class", this.youthicons[i].class);
						newimage.setAttribute("style","margin:2px;");
						newimage.title = Foxtrickl10n.getString("ForumYouthIcons."+this.youthicons[i].string);
						youthbar.appendChild( newimage );
				}
			}

			var head = toolbar.parentNode;
			head.insertBefore( youthbar, toolbar.nextSibling );
		}
	},

	change : function(page, doc) {
		var div = doc.getElementById("ft_youth_icons");
		if (!div) {
			this.run(page, doc);
		}
	},

	addTagsClick : function ( ev ) {
		try {
		var doc = ev.target.ownerDocument;

		var version = ev.target.getAttribute('version');
		if ( version ){
			Foxtrick.dump(ev.target.getAttribute('version_string')+' '+ version+'\n');
			if (version=='custom') {
							var version = prompt(Foxtrickl10n.getString("ForumSpecialBBCode.enterSeparator"));
							Foxtrick.dump('custom_seperator:'+ version+'\n');
							if (version == null || version=='') return;
						}
			FoxtrickPrefs.setString( ev.target.getAttribute('version_string'), version);
			doc.getElementById(ev.target.getAttribute('parent_id')).setAttribute('current_version', version);
			doc.getElementById(ev.target.getAttribute('parent_id')).title = doc.getElementById(ev.target.getAttribute('parent_id')).getAttribute('title_raw').replace(/%s/,version);
		}
		for (var i=0; i<FoxtrickForumYouthIcons.fields.length;++i) {
			var page = FoxtrickForumYouthIcons.fields[i].page;
			if (Foxtrick.isPage(Foxtrick.ht_pages[page], doc)) {
				FoxtrickForumYouthIcons.clickHandler(doc, FoxtrickForumYouthIcons.fields[i].textarea, ev.target.getAttribute('tags'), ev.target.getAttribute('replace_Text'), FoxtrickForumYouthIcons.fields[i].counterfield, FoxtrickForumYouthIcons.fields[i].length);
				break;
			}
		}
		} catch(e) {Foxtrick.dumpError(e);}
	},

   	clickHandler : function (doc, textareaId, openingTag, replaceText, fieldCounterId, maxLength) {
	try {

	var ta = doc.getElementById(textareaId);
	var fieldCounter = doc.getElementById(fieldCounterId);
	if (ta) {
		// link tags
		Foxtrick.dump('replaceText: '+replaceText+'\n');
		if (replaceText) {
			var s = this.getSelection(ta);
			var newText = (s.selectionLength > 0) ? openingTag.replace(replaceText, s.selectedText) : openingTag;
			Foxtrick.dump('selectedText: '+s.selectedText+'\n');
			Foxtrick.dump('newText: '+newText+'\n');

			// time
			if (replaceText == 'time'){
				newText = doc.getElementById('time').textContent;
			}

			// table
			else if (replaceText == 'ttt'){
						var seperator = FoxtrickPrefs.getString("tableSeparator");
						Foxtrick.dump('seperator'+seperator+'\n');

						if (seperator=='TAB') seperator='\\t';
						if (seperator=='|') seperator='\\|';
						if (seperator=='+') seperator='\\+';
						if (seperator=='.') seperator='\\.';
						if (seperator==' ') seperator=' +';

						// deal with some nested tags
						var myReg = new RegExp('\\[i\\](.+)('+seperator+')(.+)\\[\\/i\\]','g');
			 			newText = newText.replace(myReg,'[i]$1[/i]$2[i]$3[/i]');
						var myReg = new RegExp('\\[u\\](.+)('+seperator+')(.+)\\[\\/u\\]','g');
			 			newText = newText.replace(myReg,'[u]$1[/u]$2[u]$3[/u]');
						var myReg = new RegExp('\\[b\\](.+)('+seperator+')(.+)\\[\\/b\\]','g');
			 			newText = newText.replace(myReg,'[b]$1[/b]$2[b]$3[/b]');

						// make the table
						var myReg = new RegExp( seperator,'g');
			 			newText = newText.replace(myReg,'[/td][td]');
						newText = newText.replace(/\n/g,'[/td][/tr][tr][td]');

						// add some colspan for too short rows
						var rows = newText.split('[/tr]');
						var max_cells = 0;
						for (var i=0; i<rows.length-1; ++i) {
							max_cells =  Math.max(max_cells, rows[i].split('[/td]').length-1);
						}
						for (var i=0; i<rows.length-1; ++i) {
							var missing_col = max_cells - (rows[i].split('[/td]').length-1);
							if ( missing_col !==0 ) {
								var last_td = rows[i].lastIndexOf('[td');
								rows[i] = rows[i].substring(0,last_td+3)+' colspan='+String(missing_col+1)+rows[i].substr(last_td+3);
							}
						}
						// add header if first row is bold to some part
						if (rows[0].search(/\[b\].+\[\/b\]/)!=-1) {
							rows[0] = rows[0].replace(/\[b\]/g,'').replace(/\[\/b\]/g,'').replace(/td\]/g,'th]');
						}
						newText='';
						for (var i=0; i<rows.length-1; ++i) {
							newText += rows[i]+'[/tr]'
						}
						newText += '[/table]';
						if (s.selectionLength===0) newText='[table][tr][td]cell1[/td][td]cell2[/td][/tr][tr][td]cell3[/td][td]cell4[/td][/tr][/table]';

						// some formating
						newText = newText.replace(/table\]/g,'table]\n')
										.replace(/\/tr\]/g,'/tr]\n')
										.replace(/\[td/g,' [td')
										.replace(/\[\/td\]/g,'[/td] ')
										.replace(/\[th/g,' [th')
										.replace(/\[\/th\]/g,'[/th] ');
			}

			// Opera, Mozilla
			if (ta.selectionStart || ta.selectionStart == '0') {
				var st = ta.scrollTop;
				ta.value = s.textBeforeSelection + newText + s.textAfterSelection;
				ta.scrollTop = st;

				if ((openingTag.indexOf(' ') > 0) && (openingTag.indexOf(' ') < openingTag.length - 1)) {
					ta.selectionStart = s.selectionStart + openingTag.indexOf('=') + 1;
					ta.selectionEnd = ta.selectionStart + openingTag.indexOf(' ') - openingTag.indexOf('=') - 1;
				}

				// MessageID
				else {
					if (s.selectionLength === 0) {
						ta.selectionStart = s.selectionStart + openingTag.indexOf('=') + 1;
						ta.selectionEnd = ta.selectionStart + openingTag.indexOf(']') - openingTag.indexOf('=') - 1;
					}
					else {
						ta.selectionStart = s.selectionStart + newText.length;
						ta.selectionEnd = ta.selectionStart;
					}
					if (replaceText == 'yyy' && s.selectionLength === 0){
						ta.selectionStart = s.selectionStart + 9;
						ta.selectionEnd = ta.selectionStart + 3;
					}
					if (replaceText == 'zzz' && s.selectionLength === 0){
						ta.selectionStart = s.selectionStart + 5;
						ta.selectionEnd = ta.selectionStart + 3;
					}
					if (replaceText == 'qqq' && s.selectionLength === 0){
						ta.selectionStart = s.selectionStart + 3;
						ta.selectionEnd = ta.selectionStart + 3;
					}
					if (replaceText == 'ttt' && s.selectionLength === 0){
						ta.selectionStart = s.selectionStart + 17;
						ta.selectionEnd = ta.selectionStart + 5;
					}
				}

			}

			// Others
			else {
				ta.value += newText;
			}
		}

		// start/end tags (needed??. closingtag was null for all icons in old version)
		/*else if ((closingTag) && (counter >= 0)) {
			var s = this.getSelection(ta);
			var newText = (s.selectionLength > 0) ? openingTag + s.selectedText + closingTag : (counter % 2 == 1) ? openingTag : closingTag;

			// Opera, Mozilla
			if (ta.selectionStart || ta.selectionStart == '0') {
				var st = ta.scrollTop;
				ta.value = s.textBeforeSelection + newText + s.textAfterSelection;
				ta.scrollTop = st;

				ta.selectionStart = s.selectionStart + newText.length;
				ta.selectionEnd = ta.selectionStart;
			}

			// IE
			else if (document.selection) {
				var IESel = document.selection.createRange();
				IESel.text = newText;
				IESel.select();
			}

			// Others
			else {
				ta.value += newText;
			}
		}

		// Quote
		else if ((closingTag) && !(counter)) {
			ta.value = quoteText + '\n' + ta.value;
		}*/

		// HR
		else {
			var s = this.getSelection(ta);

			// Opera, Mozilla
			if (ta.selectionStart || ta.selectionStart == '0') {
				var st = ta.scrollTop;
				ta.value = s.textBeforeSelection + s.selectedText + openingTag + s.textAfterSelection;
				ta.scrollTop = st;

				ta.selectionStart = s.selectionEnd + openingTag.length;
				ta.selectionEnd = ta.selectionStart;
			}

			// IE
			else if (document.selection) {
				var IESel = document.selection.createRange();
				IESel.text = s.selectedText + openingTag;
				IESel.select();
			}

			// Others
			else {
				ta.value += newText;
			}
		}
	}
	this.textCounter(ta, fieldCounter, maxLength);
  } catch(e) { Foxtrick.dumpError(e);}
},

getSelection : function(ta) {
	if (ta) {
		ta.focus();

		var textAreaContents = {
			completeText: '',
			selectionStart: 0,
			selectionEnd: 0,
			selectionLength: 0,
			textBeforeSelection: '',
			selectedText: '',
			textAfterSelection: ''
		};

		if (ta.selectionStart || ta.selectionStart == '0') {
			textAreaContents.completeText = ta.value;
			textAreaContents.selectionStart = ta.selectionStart;

			if ((ta.selectionEnd - ta.selectionStart) !== 0) {
				while (ta.value.charAt(ta.selectionEnd - 1) == ' ') {
					ta.selectionEnd--;
				}
			}

			textAreaContents.selectionEnd = ta.selectionEnd;
			textAreaContents.selectionLength = ta.selectionEnd - ta.selectionStart;
			textAreaContents.textBeforeSelection = ta.value.substring(0, ta.selectionStart);

			var st = ta.value.substring(ta.selectionStart, ta.selectionEnd);

			textAreaContents.selectedText = st;
			textAreaContents.textAfterSelection = ta.value.substring(ta.selectionEnd, ta.value.length);
			return textAreaContents;
		}
	}
},

textCounter : function (field, countfield, maxlimit) {
	var text = field.value.replace(/[\r]/g, '').length;
	var text2 = field.value.replace(/[\r\n]/g, '').length; // Count without \n\r
	var diff = text - text2;
	countfield.value = maxlimit - (text2 + diff * 2);
}

};
