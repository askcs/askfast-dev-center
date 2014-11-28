/*! TableTools 2.2.3
 * 2009-2014 SpryMedia Ltd - datatables.net/license
 *
 * ZeroClipboard 1.0.4
 * Author: Joseph Huckaby - MIT licensed
 */

/**
 * @summary     TableTools
 * @description Tools and buttons for DataTables
 * @version     2.2.3
 * @file        dataTables.tableTools.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2009-2014 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/* TableTools
 * 2009-2014 SpryMedia Ltd - datatables.net/license
 */

var TableTools;(function(e,t,n){var r=function(r,i){var s={version:"1.0.4-TableTools2",clients:{},moviePath:"",nextId:1,$:function(e){return typeof e=="string"&&(e=t.getElementById(e)),e.addClass||(e.hide=function(){this.style.display="none"},e.show=function(){this.style.display=""},e.addClass=function(e){this.removeClass(e),this.className+=" "+e},e.removeClass=function(e){this.className=this.className.replace(new RegExp("\\s*"+e+"\\s*")," ").replace(/^\s+/,"").replace(/\s+$/,"")},e.hasClass=function(e){return!!this.className.match(new RegExp("\\s*"+e+"\\s*"))}),e},setMoviePath:function(e){this.moviePath=e},dispatch:function(e,t,n){var r=this.clients[e];r&&r.receiveEvent(t,n)},register:function(e,t){this.clients[e]=t},getDOMObjectPosition:function(e){var t={left:0,top:0,width:e.width?e.width:e.offsetWidth,height:e.height?e.height:e.offsetHeight};e.style.width!==""&&(t.width=e.style.width.replace("px","")),e.style.height!==""&&(t.height=e.style.height.replace("px",""));while(e)t.left+=e.offsetLeft,t.top+=e.offsetTop,e=e.offsetParent;return t},Client:function(e){this.handlers={},this.id=s.nextId++,this.movieId="ZeroClipboard_TableToolsMovie_"+this.id,s.register(this.id,this),e&&this.glue(e)}};return s.Client.prototype={id:0,ready:!1,movie:null,clipText:"",fileName:"",action:"copy",handCursorEnabled:!0,cssEffects:!0,handlers:null,sized:!1,glue:function(e,n){this.domElement=s.$(e);var r=99;this.domElement.style.zIndex&&(r=parseInt(this.domElement.style.zIndex,10)+1);var i=s.getDOMObjectPosition(this.domElement);this.div=t.createElement("div");var o=this.div.style;o.position="absolute",o.left="0px",o.top="0px",o.width=i.width+"px",o.height=i.height+"px",o.zIndex=r,typeof n!="undefined"&&n!==""&&(this.div.title=n),i.width!==0&&i.height!==0&&(this.sized=!0),this.domElement&&(this.domElement.appendChild(this.div),this.div.innerHTML=this.getHTML(i.width,i.height).replace(/&/g,"&amp;"))},positionElement:function(){var e=s.getDOMObjectPosition(this.domElement),t=this.div.style;t.position="absolute",t.width=e.width+"px",t.height=e.height+"px";if(e.width===0||e.height===0)return;this.sized=!0;var n=this.div.childNodes[0];n.width=e.width,n.height=e.height},getHTML:function(e,t){var n="",r="id="+this.id+"&width="+e+"&height="+t;if(navigator.userAgent.match(/MSIE/)){var i=location.href.match(/^https/i)?"https://":"http://";n+='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="'+i+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="'+e+'" height="'+t+'" id="'+this.movieId+'" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+s.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+r+'"/><param name="wmode" value="transparent"/></object>'}else n+='<embed id="'+this.movieId+'" src="'+s.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+e+'" height="'+t+'" name="'+this.movieId+'" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+r+'" wmode="transparent" />';return n},hide:function(){this.div&&(this.div.style.left="-2000px")},show:function(){this.reposition()},destroy:function(){if(this.domElement&&this.div){this.hide(),this.div.innerHTML="";var e=t.getElementsByTagName("body")[0];try{e.removeChild(this.div)}catch(n){}this.domElement=null,this.div=null}},reposition:function(e){e&&(this.domElement=s.$(e),this.domElement||this.hide());if(this.domElement&&this.div){var t=s.getDOMObjectPosition(this.domElement),n=this.div.style;n.left=""+t.left+"px",n.top=""+t.top+"px"}},clearText:function(){this.clipText="",this.ready&&this.movie.clearText()},appendText:function(e){this.clipText+=e,this.ready&&this.movie.appendText(e)},setText:function(e){this.clipText=e,this.ready&&this.movie.setText(e)},setCharSet:function(e){this.charSet=e,this.ready&&this.movie.setCharSet(e)},setBomInc:function(e){this.incBom=e,this.ready&&this.movie.setBomInc(e)},setFileName:function(e){this.fileName=e,this.ready&&this.movie.setFileName(e)},setAction:function(e){this.action=e,this.ready&&this.movie.setAction(e)},addEventListener:function(e,t){e=e.toString().toLowerCase().replace(/^on/,""),this.handlers[e]||(this.handlers[e]=[]),this.handlers[e].push(t)},setHandCursor:function(e){this.handCursorEnabled=e,this.ready&&this.movie.setHandCursor(e)},setCSSEffects:function(e){this.cssEffects=!!e},receiveEvent:function(n,r){var i;n=n.toString().toLowerCase().replace(/^on/,"");switch(n){case"load":this.movie=t.getElementById(this.movieId);if(!this.movie){i=this,setTimeout(function(){i.receiveEvent("load",null)},1);return}if(!this.ready&&navigator.userAgent.match(/Firefox/)&&navigator.userAgent.match(/Windows/)){i=this,setTimeout(function(){i.receiveEvent("load",null)},100),this.ready=!0;return}this.ready=!0,this.movie.clearText(),this.movie.appendText(this.clipText),this.movie.setFileName(this.fileName),this.movie.setAction(this.action),this.movie.setCharSet(this.charSet),this.movie.setBomInc(this.incBom),this.movie.setHandCursor(this.handCursorEnabled);break;case"mouseover":this.domElement&&this.cssEffects&&this.recoverActive&&this.domElement.addClass("active");break;case"mouseout":this.domElement&&this.cssEffects&&(this.recoverActive=!1,this.domElement.hasClass("active")&&(this.domElement.removeClass("active"),this.recoverActive=!0));break;case"mousedown":this.domElement&&this.cssEffects&&this.domElement.addClass("active");break;case"mouseup":this.domElement&&this.cssEffects&&(this.domElement.removeClass("active"),this.recoverActive=!1)}if(this.handlers[n])for(var s=0,o=this.handlers[n].length;s<o;s++){var u=this.handlers[n][s];typeof u=="function"?u(this,r):typeof u=="object"&&u.length==2?u[0][u[1]](this,r):typeof u=="string"&&e[u](this,r)}}},e.ZeroClipboard_TableTools=s,function(e,t,r){TableTools=function(t,n){!this instanceof TableTools&&alert("Warning: TableTools must be initialised with the keyword 'new'");var r=e.fn.dataTable.Api?(new e.fn.dataTable.Api(t)).settings()[0]:t.fnSettings();return this.s={that:this,dt:r,print:{saveStart:-1,saveLength:-1,saveScroll:-1,funcEnd:function(){}},buttonCounter:0,select:{type:"",selected:[],preRowSelect:null,postSelected:null,postDeselected:null,all:!1,selectedClass:""},custom:{},swfPath:"",buttonSet:[],master:!1,tags:{}},this.dom={container:null,table:null,print:{hidden:[],message:null},collection:{collection:null,background:null}},this.classes=e.extend(!0,{},TableTools.classes),this.s.dt.bJUI&&e.extend(!0,this.classes,TableTools.classes_themeroller),this.fnSettings=function(){return this.s},typeof n=="undefined"&&(n={}),TableTools._aInstances.push(this),this._fnConstruct(n),this},TableTools.prototype={fnGetSelected:function(e){var t=[],n=this.s.dt.aoData,r=this.s.dt.aiDisplay,i,s;if(e)for(i=0,s=r.length;i<s;i++)n[r[i]]._DTTT_selected&&t.push(n[r[i]].nTr);else for(i=0,s=n.length;i<s;i++)n[i]._DTTT_selected&&t.push(n[i].nTr);return t},fnGetSelectedData:function(){var e=[],t=this.s.dt.aoData,n,r;for(n=0,r=t.length;n<r;n++)t[n]._DTTT_selected&&e.push(this.s.dt.oInstance.fnGetData(n));return e},fnGetSelectedIndexes:function(e){var t=[],n=this.s.dt.aoData,r=this.s.dt.aiDisplay,i,s;if(e)for(i=0,s=r.length;i<s;i++)n[r[i]]._DTTT_selected&&t.push(r[i]);else for(i=0,s=n.length;i<s;i++)n[i]._DTTT_selected&&t.push(i);return t},fnIsSelected:function(e){var t=this.s.dt.oInstance.fnGetPosition(e);return this.s.dt.aoData[t]._DTTT_selected===!0?!0:!1},fnSelectAll:function(e){this._fnRowSelect(e?this.s.dt.aiDisplay:this.s.dt.aoData)},fnSelectNone:function(e){this._fnRowDeselect(this.fnGetSelectedIndexes(e))},fnSelect:function(e){this.s.select.type=="single"?(this.fnSelectNone(),this._fnRowSelect(e)):this._fnRowSelect(e)},fnDeselect:function(e){this._fnRowDeselect(e)},fnGetTitle:function(e){var t="";if(typeof e.sTitle!="undefined"&&e.sTitle!=="")t=e.sTitle;else{var n=r.getElementsByTagName("title");n.length>0&&(t=n[0].innerHTML)}return"¡".toString().length<4?t.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g,""):t.replace(/[^a-zA-Z0-9_\.,\-_ !\(\)]/g,"")},fnCalcColRatios:function(e){var t=this.s.dt.aoColumns,n=this._fnColumnTargets(e.mColumns),r=[],i=0,s=0,o,u;for(o=0,u=n.length;o<u;o++)n[o]&&(i=t[o].nTh.offsetWidth,s+=i,r.push(i));for(o=0,u=r.length;o<u;o++)r[o]=r[o]/s;return r.join("	")},fnGetTableData:function(e){if(this.s.dt)return this._fnGetDataTablesData(e)},fnSetText:function(e,t){this._fnFlashSetText(e,t)},fnResizeButtons:function(){for(var e in s.clients)if(e){var t=s.clients[e];typeof t.domElement!="undefined"&&t.domElement.parentNode&&t.positionElement()}},fnResizeRequired:function(){for(var e in s.clients)if(e){var t=s.clients[e];if(typeof t.domElement!="undefined"&&t.domElement.parentNode==this.dom.container&&t.sized===!1)return!0}return!1},fnPrint:function(e,t){t===n&&(t={}),e===n||e?this._fnPrintStart(t):this._fnPrintEnd()},fnInfo:function(t,n){var r=e("<div/>").addClass(this.classes.print.info).html(t).appendTo("body");setTimeout(function(){r.fadeOut("normal",function(){r.remove()})},n)},fnContainer:function(){return this.dom.container},_fnConstruct:function(t){var n=this;this._fnCustomiseSettings(t),this.dom.container=r.createElement(this.s.tags.container),this.dom.container.className=this.classes.container,this.s.select.type!="none"&&this._fnRowSelectConfig(),this._fnButtonDefinations(this.s.buttonSet,this.dom.container),this.s.dt.aoDestroyCallback.push({sName:"TableTools",fn:function(){e(n.s.dt.nTBody).off("click.DTTT_Select","tr"),e(n.dom.container).empty();var t=e.inArray(n,TableTools._aInstances);t!==-1&&TableTools._aInstances.splice(t,1)}})},_fnCustomiseSettings:function(t){typeof this.s.dt._TableToolsInit=="undefined"&&(this.s.master=!0,this.s.dt._TableToolsInit=!0),this.dom.table=this.s.dt.nTable,this.s.custom=e.extend({},TableTools.DEFAULTS,t),this.s.swfPath=this.s.custom.sSwfPath,typeof s!="undefined"&&(s.moviePath=this.s.swfPath),this.s.select.type=this.s.custom.sRowSelect,this.s.select.preRowSelect=this.s.custom.fnPreRowSelect,this.s.select.postSelected=this.s.custom.fnRowSelected,this.s.select.postDeselected=this.s.custom.fnRowDeselected,this.s.custom.sSelectedClass&&(this.classes.select.row=this.s.custom.sSelectedClass),this.s.tags=this.s.custom.oTags,this.s.buttonSet=this.s.custom.aButtons},_fnButtonDefinations:function(t,n){var r;for(var i=0,s=t.length;i<s;i++){if(typeof t[i]=="string"){if(typeof TableTools.BUTTONS[t[i]]=="undefined"){alert("TableTools: Warning - unknown button type: "+t[i]);continue}r=e.extend({},TableTools.BUTTONS[t[i]],!0)}else{if(typeof TableTools.BUTTONS[t[i].sExtends]=="undefined"){alert("TableTools: Warning - unknown button type: "+t[i].sExtends);continue}var o=e.extend({},TableTools.BUTTONS[t[i].sExtends],!0);r=e.extend(o,t[i],!0)}var u=this._fnCreateButton(r,e(n).hasClass(this.classes.collection.container));u&&n.appendChild(u)}},_fnCreateButton:function(t,n){var r=this._fnButtonBase(t,n);if(t.sAction.match(/flash/)){if(!this._fnHasFlash())return!1;this._fnFlashConfig(r,t)}else t.sAction=="text"?this._fnTextConfig(r,t):t.sAction=="div"?this._fnTextConfig(r,t):t.sAction=="collection"&&(this._fnTextConfig(r,t),this._fnCollectionConfig(r,t));return this.s.dt.iTabIndex!==-1&&e(r).attr("tabindex",this.s.dt.iTabIndex).attr("aria-controls",this.s.dt.sTableId).on("keyup.DTTT",function(t){t.keyCode===13&&(t.stopPropagation(),e(this).trigger("click"))}).on("mousedown.DTTT",function(e){t.sAction.match(/flash/)||e.preventDefault()}),r},_fnButtonBase:function(e,t){var n,i,s;t?(n=e.sTag&&e.sTag!=="default"?e.sTag:this.s.tags.collection.button,i=e.sLinerTag&&e.sLinerTag!=="default"?e.sLiner:this.s.tags.collection.liner,s=this.classes.collection.buttons.normal):(n=e.sTag&&e.sTag!=="default"?e.sTag:this.s.tags.button,i=e.sLinerTag&&e.sLinerTag!=="default"?e.sLiner:this.s.tags.liner,s=this.classes.buttons.normal);var o=r.createElement(n),u=r.createElement(i),a=this._fnGetMasterSettings();return o.className=s+" "+e.sButtonClass,o.setAttribute("id","ToolTables_"+this.s.dt.sInstance+"_"+a.buttonCounter),o.appendChild(u),u.innerHTML=e.sButtonText,a.buttonCounter++,o},_fnGetMasterSettings:function(){if(this.s.master)return this.s;var e=TableTools._aInstances;for(var t=0,n=e.length;t<n;t++)if(this.dom.table==e[t].s.dt.nTable)return e[t].s},_fnCollectionConfig:function(e,t){var n=r.createElement(this.s.tags.collection.container);n.style.display="none",n.className=this.classes.collection.container,t._collection=n,r.body.appendChild(n),this._fnButtonDefinations(t.aButtons,n)},_fnCollectionShow:function(n,i){var s=this,o=e(n).offset(),u=i._collection,a=o.left,f=o.top+e(n).outerHeight(),l=e(t).height(),c=e(r).height(),h=e(t).width(),p=e(r).width();u.style.position="absolute",u.style.left=a+"px",u.style.top=f+"px",u.style.display="block",e(u).css("opacity",0);var d=r.createElement("div");d.style.position="absolute",d.style.left="0px",d.style.top="0px",d.style.height=(l>c?l:c)+"px",d.style.width=(h>p?h:p)+"px",d.className=this.classes.collection.background,e(d).css("opacity",0),r.body.appendChild(d),r.body.appendChild(u);var v=e(u).outerWidth(),m=e(u).outerHeight();a+v>p&&(u.style.left=p-v+"px"),f+m>c&&(u.style.top=f-m-e(n).outerHeight()+"px"),this.dom.collection.collection=u,this.dom.collection.background=d,setTimeout(function(){e(u).animate({opacity:1},500),e(d).animate({opacity:.25},500)},10),this.fnResizeButtons(),e(d).click(function(){s._fnCollectionHide.call(s,null,null)})},_fnCollectionHide:function(t,n){if(n!==null&&n.sExtends=="collection")return;this.dom.collection.collection!==null&&(e(this.dom.collection.collection).animate({opacity:0},500,function(e){this.style.display="none"}),e(this.dom.collection.background).animate({opacity:0},500,function(e){this.parentNode.removeChild(this)}),this.dom.collection.collection=null,this.dom.collection.background=null)},_fnRowSelectConfig:function(){if(this.s.master){var t=this,n,r,i=this.s.dt,s=this.s.dt.aoOpenRows;e(i.nTable).addClass(this.classes.select.table),this.s.select.type==="os"&&(e(i.nTBody).on("mousedown.DTTT_Select","tr",function(t){t.shiftKey&&e(i.nTBody).css("-moz-user-select","none").one("selectstart.DTTT_Select","tr",function(){return!1})}),e(i.nTBody).on("mouseup.DTTT_Select","tr",function(t){e(i.nTBody).css("-moz-user-select","")})),e(i.nTBody).on("click.DTTT_Select",this.s.custom.sRowSelector,function(n){var r=this.nodeName.toLowerCase()==="tr"?this:e(this).parents("tr")[0],s=t.s.select,o=t.s.dt.oInstance.fnGetPosition(r);if(r.parentNode!=i.nTBody)return;if(i.oInstance.fnGetData(r)===null)return;if(s.type=="os")if(n.ctrlKey||n.metaKey)t.fnIsSelected(r)?t._fnRowDeselect(r,n):t._fnRowSelect(r,n);else if(n.shiftKey){var u=t.s.dt.aiDisplay.slice(),a=e.inArray(s.lastRow,u),f=e.inArray(o,u);if(t.fnGetSelected().length===0||a===-1)u.splice(e.inArray(o,u)+1,u.length);else{if(a>f){var l=f;f=a,a=l}u.splice(f+1,u.length),u.splice(0,a)}t.fnIsSelected(r)?(u.splice(e.inArray(o,u),1),t._fnRowDeselect(u,n)):t._fnRowSelect(u,n)}else t.fnIsSelected(r)&&t.fnGetSelected().length===1?t._fnRowDeselect(r,n):(t.fnSelectNone(),t._fnRowSelect(r,n));else t.fnIsSelected(r)?t._fnRowDeselect(r,n):s.type=="single"?(t.fnSelectNone(),t._fnRowSelect(r,n)):s.type=="multi"&&t._fnRowSelect(r,n);s.lastRow=o}),i.oApi._fnCallbackReg(i,"aoRowCreatedCallback",function(n,r,s){i.aoData[s]._DTTT_selected&&e(n).addClass(t.classes.select.row)},"TableTools-SelectAll")}},_fnRowSelect:function(t,n){var r=this,i=this._fnSelectData(t),s=i.length===0?null:i[0].nTr,o=[],u,a;for(u=0,a=i.length;u<a;u++)i[u].nTr&&o.push(i[u].nTr);if(this.s.select.preRowSelect!==null&&!this.s.select.preRowSelect.call(this,n,o,!0))return;for(u=0,a=i.length;u<a;u++)i[u]._DTTT_selected=!0,i[u].nTr&&e(i[u].nTr).addClass(r.classes.select.row);this.s.select.postSelected!==null&&this.s.select.postSelected.call(this,o),TableTools._fnEventDispatch(this,"select",o,!0)},_fnRowDeselect:function(t,n){var r=this,i=this._fnSelectData(t),s=i.length===0?null:i[0].nTr,o=[],u,a;for(u=0,a=i.length;u<a;u++)i[u].nTr&&o.push(i[u].nTr);if(this.s.select.preRowSelect!==null&&!this.s.select.preRowSelect.call(this,n,o,!1))return;for(u=0,a=i.length;u<a;u++)i[u]._DTTT_selected=!1,i[u].nTr&&e(i[u].nTr).removeClass(r.classes.select.row);this.s.select.postDeselected!==null&&this.s.select.postDeselected.call(this,o),TableTools._fnEventDispatch(this,"select",o,!1)},_fnSelectData:function(e){var t=[],n,r,i;if(e.nodeName)n=this.s.dt.oInstance.fnGetPosition(e),t.push(this.s.dt.aoData[n]);else{if(typeof e.length!="undefined"){for(r=0,i=e.length;r<i;r++)e[r].nodeName?(n=this.s.dt.oInstance.fnGetPosition(e[r]),t.push(this.s.dt.aoData[n])):typeof e[r]=="number"?t.push(this.s.dt.aoData[e[r]]):t.push(e[r]);return t}t.push(e)}return t},_fnTextConfig:function(t,n){var r=this;n.fnInit!==null&&n.fnInit.call(this,t,n),n.sToolTip!==""&&(t.title=n.sToolTip),e(t).hover(function(){n.fnMouseover!==null&&n.fnMouseover.call(this,t,n,null)},function(){n.fnMouseout!==null&&n.fnMouseout.call(this,t,n,null)}),n.fnSelect!==null&&TableTools._fnEventListen(this,"select",function(e){n.fnSelect.call(r,t,n,e)}),e(t).click(function(e){n.fnClick!==null&&n.fnClick.call(r,t,n,null,e),n.fnComplete!==null&&n.fnComplete.call(r,t,n,null,null),r._fnCollectionHide(t,n)})},_fnHasFlash:function(){try{var e=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");if(e)return!0}catch(t){if(navigator.mimeTypes&&navigator.mimeTypes["application/x-shockwave-flash"]!==n&&navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin)return!0}return!1},_fnFlashConfig:function(e,t){var n=this,r=new s.Client;t.fnInit!==null&&t.fnInit.call(this,e,t),r.setHandCursor(!0),t.sAction=="flash_save"?(r.setAction("save"),r.setCharSet(t.sCharSet=="utf16le"?"UTF16LE":"UTF8"),r.setBomInc(t.bBomInc),r.setFileName(t.sFileName.replace("*",this.fnGetTitle(t)))):t.sAction=="flash_pdf"?(r.setAction("pdf"),r.setFileName(t.sFileName.replace("*",this.fnGetTitle(t)))):r.setAction("copy"),r.addEventListener("mouseOver",function(i){t.fnMouseover!==null&&t.fnMouseover.call(n,e,t,r)}),r.addEventListener("mouseOut",function(i){t.fnMouseout!==null&&t.fnMouseout.call(n,e,t,r)}),r.addEventListener("mouseDown",function(i){t.fnClick!==null&&t.fnClick.call(n,e,t,r)}),r.addEventListener("complete",function(i,s){t.fnComplete!==null&&t.fnComplete.call(n,e,t,r,s),n._fnCollectionHide(e,t)}),this._fnFlashGlue(r,e,t.sToolTip)},_fnFlashGlue:function(e,t,n){var i=this,s=t.getAttribute("id");r.getElementById(s)?e.glue(t,n):setTimeout(function(){i._fnFlashGlue(e,t,n)},100)},_fnFlashSetText:function(e,t){var n=this._fnChunkData(t,8192);e.clearText();for(var r=0,i=n.length;r<i;r++)e.appendText(n[r])},_fnColumnTargets:function(t){var n=[],r=this.s.dt,i,s,o=r.aoColumns,u=o.length;if(typeof t=="function"){var a=t.call(this,r);for(i=0,s=u;i<s;i++)n.push(e.inArray(i,a)!==-1?!0:!1)}else if(typeof t=="object"){for(i=0,s=u;i<s;i++)n.push(!1);for(i=0,s=t.length;i<s;i++)n[t[i]]=!0}else if(t=="visible")for(i=0,s=u;i<s;i++)n.push(o[i].bVisible?!0:!1);else if(t=="hidden")for(i=0,s=u;i<s;i++)n.push(o[i].bVisible?!1:!0);else if(t=="sortable")for(i=0,s=u;i<s;i++)n.push(o[i].bSortable?!0:!1);else for(i=0,s=u;i<s;i++)n.push(!0);return n},_fnNewline:function(e){return e.sNewLine=="auto"?navigator.userAgent.match(/Windows/)?"\r\n":"\n":e.sNewLine},_fnGetDataTablesData:function(t){var n,r,s,o,u,a=[],f="",l,c=this.s.dt,h,p,d=new RegExp(t.sFieldBoundary,"g"),v=this._fnColumnTargets(t.mColumns),m=typeof t.bSelectedOnly!="undefined"?t.bSelectedOnly:!1;if(t.bHeader){u=[];for(n=0,r=c.aoColumns.length;n<r;n++)v[n]&&(f=c.aoColumns[n].sTitle.replace(/\n/g," ").replace(/<.*?>/g,"").replace(/^\s+|\s+$/g,""),f=this._fnHtmlDecode(f),u.push(this._fnBoundData(f,t.sFieldBoundary,d)));a.push(u.join(t.sFieldSeperator))}m=!0;var g,y=this.fnGetSelectedIndexes();m=this.s.select.type!=="none"&&m&&y.length!==0,m?g=y:i.Api?g=(new i.Api(c)).rows(t.oSelectorOpts).indexes().flatten().toArray():g=c.oInstance.$("tr",t.oSelectorOpts).map(function(e,t){return c.oInstance.fnGetPosition(t)}).get();for(s=0,o=g.length;s<o;s++){h=c.aoData[g[s]].nTr,u=[];for(n=0,r=c.aoColumns.length;n<r;n++)if(v[n]){var b=c.oApi._fnGetCellData(c,g[s],n,"display");t.fnCellRender?f=t.fnCellRender(b,n,h,g[s])+"":typeof b=="string"?(f=b.replace(/\n/g," "),f=f.replace(/<img.*?\s+alt\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+)).*?>/gi,"$1$2$3"),f=f.replace(/<.*?>/g,"")):f=b+"",f=f.replace(/^\s+/,"").replace(/\s+$/,""),f=this._fnHtmlDecode(f),u.push(this._fnBoundData(f,t.sFieldBoundary,d))}a.push(u.join(t.sFieldSeperator)),t.bOpenRows&&(l=e.grep(c.aoOpenRows,function(e){return e.nParent===h}),l.length===1&&(f=this._fnBoundData(e("td",l[0].nTr).html(),t.sFieldBoundary,d),a.push(f)))}if(t.bFooter&&c.nTFoot!==null){u=[];for(n=0,r=c.aoColumns.length;n<r;n++)v[n]&&c.aoColumns[n].nTf!==null&&(f=c.aoColumns[n].nTf.innerHTML.replace(/\n/g," ").replace(/<.*?>/g,""),f=this._fnHtmlDecode(f),u.push(this._fnBoundData(f,t.sFieldBoundary,d)));a.push(u.join(t.sFieldSeperator))}var w=a.join(this._fnNewline(t));return w},_fnBoundData:function(e,t,n){return t===""?e:t+e.replace(n,t+t)+t},_fnChunkData:function(e,t){var n=[],r=e.length;for(var i=0;i<r;i+=t)i+t<r?n.push(e.substring(i,i+t)):n.push(e.substring(i,r));return n},_fnHtmlDecode:function(e){if(e.indexOf("&")===-1)return e;var t=r.createElement("div");return e.replace(/&([^\s]*?);/g,function(e,n){return e.substr(1,1)==="#"?String.fromCharCode(Number(n.substr(1))):(t.innerHTML=e,t.childNodes[0].nodeValue)})},_fnPrintStart:function(n){var i=this,s=this.s.dt;this._fnPrintHideNodes(s.nTable),this.s.print.saveStart=s._iDisplayStart,this.s.print.saveLength=s._iDisplayLength,n.bShowAll&&(s._iDisplayStart=0,s._iDisplayLength=-1,s.oApi._fnCalculateEnd&&s.oApi._fnCalculateEnd(s),s.oApi._fnDraw(s));if(s.oScroll.sX!==""||s.oScroll.sY!=="")this._fnPrintScrollStart(s),e(this.s.dt.nTable).bind("draw.DTTT_Print",function(){i._fnPrintScrollStart(s)});var o=s.aanFeatures;for(var u in o)if(u!="i"&&u!="t"&&u.length==1)for(var a=0,f=o[u].length;a<f;a++)this.dom.print.hidden.push({node:o[u][a],display:"block"}),o[u][a].style.display="none";e(r.body).addClass(this.classes.print.body),n.sInfo!==""&&this.fnInfo(n.sInfo,3e3),n.sMessage&&e("<div/>").addClass(this.classes.print.message).html(n.sMessage).prependTo("body"),this.s.print.saveScroll=e(t).scrollTop(),t.scrollTo(0,0),e(r).bind("keydown.DTTT",function(e){e.keyCode==27&&(e.preventDefault(),i._fnPrintEnd.call(i,e))})},_fnPrintEnd:function(n){var i=this,s=this.s.dt,o=this.s.print,u=this.dom.print;this._fnPrintShowNodes();if(s.oScroll.sX!==""||s.oScroll.sY!=="")e(this.s.dt.nTable).unbind("draw.DTTT_Print"),this._fnPrintScrollEnd();t.scrollTo(0,o.saveScroll),e("div."+this.classes.print.message).remove(),e(r.body).removeClass("DTTT_Print"),s._iDisplayStart=o.saveStart,s._iDisplayLength=o.saveLength,s.oApi._fnCalculateEnd&&s.oApi._fnCalculateEnd(s),s.oApi._fnDraw(s),e(r).unbind("keydown.DTTT")},_fnPrintScrollStart:function(){var t=this.s.dt,n=t.nScrollHead.getElementsByTagName("div")[0],r=n.getElementsByTagName("table")[0],i=t.nTable.parentNode,s,o;s=t.nTable.getElementsByTagName("thead"),s.length>0&&t.nTable.removeChild(s[0]),t.nTFoot!==null&&(o=t.nTable.getElementsByTagName("tfoot"),o.length>0&&t.nTable.removeChild(o[0])),s=t.nTHead.cloneNode(!0),t.nTable.insertBefore(s,t.nTable.childNodes[0]),t.nTFoot!==null&&(o=t.nTFoot.cloneNode(!0),t.nTable.insertBefore(o,t.nTable.childNodes[1])),t.oScroll.sX!==""&&(t.nTable.style.width=e(t.nTable).outerWidth()+"px",i.style.width=e(t.nTable).outerWidth()+"px",i.style.overflow="visible"),t.oScroll.sY!==""&&(i.style.height=e(t.nTable).outerHeight()+"px",i.style.overflow="visible")},_fnPrintScrollEnd:function(){var e=this.s.dt,t=e.nTable.parentNode;e.oScroll.sX!==""&&(t.style.width=e.oApi._fnStringToCss(e.oScroll.sX),t.style.overflow="auto"),e.oScroll.sY!==""&&(t.style.height=e.oApi._fnStringToCss(e.oScroll.sY),t.style.overflow="auto")},_fnPrintShowNodes:function(){var e=this.dom.print.hidden;for(var t=0,n=e.length;t<n;t++)e[t].node.style.display=e[t].display;e.splice(0,e.length)},_fnPrintHideNodes:function(t){var n=this.dom.print.hidden,r=t.parentNode,i=r.childNodes;for(var s=0,o=i.length;s<o;s++)if(i[s]!=t&&i[s].nodeType==1){var u=e(i[s]).css("display");u!="none"&&(n.push({node:i[s],display:u}),i[s].style.display="none")}r.nodeName.toUpperCase()!="BODY"&&this._fnPrintHideNodes(r)}},TableTools._aInstances=[],TableTools._aListeners=[],TableTools.fnGetMasters=function(){var e=[];for(var t=0,n=TableTools._aInstances.length;t<n;t++)TableTools._aInstances[t].s.master&&e.push(TableTools._aInstances[t]);return e},TableTools.fnGetInstance=function(e){typeof e!="object"&&(e=r.getElementById(e));for(var t=0,n=TableTools._aInstances.length;t<n;t++)if(TableTools._aInstances[t].s.master&&TableTools._aInstances[t].dom.table==e)return TableTools._aInstances[t];return null},TableTools._fnEventListen=function(e,t,n){TableTools._aListeners.push({that:e,type:t,fn:n})},TableTools._fnEventDispatch=function(e,t,n,r){var i=TableTools._aListeners;for(var s=0,o=i.length;s<o;s++)e.dom.table==i[s].that.dom.table&&i[s].type==t&&i[s].fn(n,r)},TableTools.buttonBase={sAction:"text",sTag:"default",sLinerTag:"default",sButtonClass:"DTTT_button_text",sButtonText:"Button text",sTitle:"",sToolTip:"",sCharSet:"utf8",bBomInc:!1,sFileName:"*.csv",sFieldBoundary:"",sFieldSeperator:"	",sNewLine:"auto",mColumns:"all",bHeader:!0,bFooter:!0,bOpenRows:!1,bSelectedOnly:!1,oSelectorOpts:n,fnMouseover:null,fnMouseout:null,fnClick:null,fnSelect:null,fnComplete:null,fnInit:null,fnCellRender:null},TableTools.BUTTONS={csv:e.extend({},TableTools.buttonBase,{sAction:"flash_save",sButtonClass:"DTTT_button_csv",sButtonText:"CSV",sFieldBoundary:'"',sFieldSeperator:",",fnClick:function(e,t,n){this.fnSetText(n,this.fnGetTableData(t))}}),xls:e.extend({},TableTools.buttonBase,{sAction:"flash_save",sCharSet:"utf16le",bBomInc:!0,sButtonClass:"DTTT_button_xls",sButtonText:"Excel",fnClick:function(e,t,n){this.fnSetText(n,this.fnGetTableData(t))}}),copy:e.extend({},TableTools.buttonBase,{sAction:"flash_copy",sButtonClass:"DTTT_button_copy",sButtonText:"Copy",fnClick:function(e,t,n){this.fnSetText(n,this.fnGetTableData(t))},fnComplete:function(e,t,n,r){var i=r.split("\n").length;t.bHeader&&i--,this.s.dt.nTFoot!==null&&t.bFooter&&i--;var s=i==1?"":"s";this.fnInfo("<h6>Table copied</h6><p>Copied "+i+" row"+s+" to the clipboard.</p>",1500)}}),pdf:e.extend({},TableTools.buttonBase,{sAction:"flash_pdf",sNewLine:"\n",sFileName:"*.pdf",sButtonClass:"DTTT_button_pdf",sButtonText:"PDF",sPdfOrientation:"portrait",sPdfSize:"A4",sPdfMessage:"",fnClick:function(e,t,n){this.fnSetText(n,"title:"+this.fnGetTitle(t)+"\n"+"message:"+t.sPdfMessage+"\n"+"colWidth:"+this.fnCalcColRatios(t)+"\n"+"orientation:"+t.sPdfOrientation+"\n"+"size:"+t.sPdfSize+"\n"+"--/TableToolsOpts--\n"+this.fnGetTableData(t))}}),print:e.extend({},TableTools.buttonBase,{sInfo:"<h6>Print view</h6><p>Please use your browser's print function to print this table. Press escape when finished.</p>",sMessage:null,bShowAll:!0,sToolTip:"View print view",sButtonClass:"DTTT_button_print",sButtonText:"Print",fnClick:function(e,t){this.fnPrint(!0,t)}}),text:e.extend({},TableTools.buttonBase),select:e.extend({},TableTools.buttonBase,{sButtonText:"Select button",fnSelect:function(t,n){this.fnGetSelected().length!==0?e(t).removeClass(this.classes.buttons.disabled):e(t).addClass(this.classes.buttons.disabled)},fnInit:function(t,n){e(t).addClass(this.classes.buttons.disabled)}}),select_single:e.extend({},TableTools.buttonBase,{sButtonText:"Select button",fnSelect:function(t,n){var r=this.fnGetSelected().length;r==1?e(t).removeClass(this.classes.buttons.disabled):e(t).addClass(this.classes.buttons.disabled)},fnInit:function(t,n){e(t).addClass(this.classes.buttons.disabled)}}),select_all:e.extend({},TableTools.buttonBase,{sButtonText:"Select all",fnClick:function(e,t){this.fnSelectAll()},fnSelect:function(t,n){this.fnGetSelected().length==this.s.dt.fnRecordsDisplay()?e(t).addClass(this.classes.buttons.disabled):e(t).removeClass(this.classes.buttons.disabled)}}),select_none:e.extend({},TableTools.buttonBase,{sButtonText:"Deselect all",fnClick:function(e,t){this.fnSelectNone()},fnSelect:function(t,n){this.fnGetSelected().length!==0?e(t).removeClass(this.classes.buttons.disabled):e(t).addClass(this.classes.buttons.disabled)},fnInit:function(t,n){e(t).addClass(this.classes.buttons.disabled)}}),ajax:e.extend({},TableTools.buttonBase,{sAjaxUrl:"/xhr.php",sButtonText:"Ajax button",fnClick:function(t,n){var r=this.fnGetTableData(n);e.ajax({url:n.sAjaxUrl,data:[{name:"tableData",value:r}],success:n.fnAjaxComplete,dataType:"json",type:"POST",cache:!1,error:function(){alert("Error detected when sending table data to server")}})},fnAjaxComplete:function(e){alert("Ajax complete")}}),div:e.extend({},TableTools.buttonBase,{sAction:"div",sTag:"div",sButtonClass:"DTTT_nonbutton",sButtonText:"Text button"}),collection:e.extend({},TableTools.buttonBase,{sAction:"collection",sButtonClass:"DTTT_button_collection",sButtonText:"Collection",fnClick:function(e,t){this._fnCollectionShow(e,t)}})},TableTools.buttons=TableTools.BUTTONS,TableTools.classes={container:"DTTT_container",buttons:{normal:"DTTT_button",disabled:"DTTT_disabled"},collection:{container:"DTTT_collection",background:"DTTT_collection_background",buttons:{normal:"DTTT_button",disabled:"DTTT_disabled"}},select:{table:"DTTT_selectable",row:"DTTT_selected selected"},print:{body:"DTTT_Print",info:"DTTT_print_info",message:"DTTT_PrintMessage"}},TableTools.classes_themeroller={container:"DTTT_container ui-buttonset ui-buttonset-multi",buttons:{normal:"DTTT_button ui-button ui-state-default"},collection:{container:"DTTT_collection ui-buttonset ui-buttonset-multi"}},TableTools.DEFAULTS={sSwfPath:"../swf/copy_csv_xls_pdf.swf",sRowSelect:"none",sRowSelector:"tr",sSelectedClass:null,fnPreRowSelect:null,fnRowSelected:null,fnRowDeselected:null,aButtons:["copy","csv","xls","pdf","print"],oTags:{container:"div",button:"a",liner:"span",collection:{container:"div",button:"a",liner:"span"}}},TableTools.defaults=TableTools.DEFAULTS,TableTools.prototype.CLASS="TableTools",TableTools.version="2.2.3",e.fn.dataTable.Api&&e.fn.dataTable.Api.register("tabletools()",function(){var e=null;return this.context.length>0&&(e=TableTools.fnGetInstance(this.context[0].nTable)),e}),typeof e.fn.dataTable=="function"&&typeof e.fn.dataTableExt.fnVersionCheck=="function"&&e.fn.dataTableExt.fnVersionCheck("1.9.0")?e.fn.dataTableExt.aoFeatures.push({fnInit:function(e){var t=e.oInit,n=t?t.tableTools||t.oTableTools||{}:{};return(new TableTools(e.oInstance,n)).dom.container},cFeature:"T",sFeature:"TableTools"}):alert("Warning: TableTools requires DataTables 1.9.0 or newer - www.datatables.net/download"),e.fn.DataTable.TableTools=TableTools}(jQuery,e,t),typeof r.fn.dataTable=="function"&&typeof r.fn.dataTableExt.fnVersionCheck=="function"&&r.fn.dataTableExt.fnVersionCheck("1.9.0")?r.fn.dataTableExt.aoFeatures.push({fnInit:function(e){var t=typeof e.oInit.oTableTools!="undefined"?e.oInit.oTableTools:{},n=new TableTools(e.oInstance,t);return TableTools._aInstances.push(n),n.dom.container},cFeature:"T",sFeature:"TableTools"}):alert("Warning: TableTools 2 requires DataTables 1.9.0 or newer - www.datatables.net/download"),r.fn.dataTable.TableTools=TableTools,r.fn.DataTable.TableTools=TableTools,TableTools};typeof define=="function"&&define.amd?define(["jquery","datatables"],r):typeof exports=="object"?r(require("jquery"),require("datatables")):jQuery&&!jQuery.fn.dataTable.TableTools&&r(jQuery,jQuery.fn.dataTable)})(window,document);