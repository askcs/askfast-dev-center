define(["filters/filters"],function(e){e.filter("translateAdapterAddress",["Store",function(e){e=e("data");var t=e.get("adapterTypes"),n={};return function(e){if(e&&e.adapterType)switch(e.adapterType){case"broadsoft":if(/@/.test(e.myAddress))return e.myAddress.split("@")[0];break;default:return e.myAddress}}}]),e.filter("translateAdapterType",[function(){return function(e){var t=e.adapterType;switch(t){case"broadsoft":case"voxeo":return"Phone";case"xmpp":return"Gtalk";case"email":return"Email";default:return t}}}]),e.filter("parseTimeStamp",["Moment",function(e){return function(t){return e(t).format("dddd, MMMM Do YYYY, h:mm:ss a")}}]),e.filter("filterAdapters",[function(){return function(e,t){if(e&&t){var n=[];return angular.forEach(e,function(e){e.dialogId==t.id&&n.push(e)}),n}}}]),e.filter("dashboardLogs",[function(){return function(e){var t=0;if(e){var n=[];return angular.forEach(e,function(e){e.level=="SEVERE"&&(e.logId=t,t+=1,n.push(e))}),n}}}]),e.filter("mediumToType",[function(){return function(e){switch(e){case"broadsoft":case"voxeo":return"Phone";case"xmpp":return"Gtalk";case"email":return"Email";case"email":return"SMS";default:return e}}}]),e.filter("accountType",function(){return function(e){switch(e){case"TRIAL":return"Trial";case"PRE_PAID":return"Pre-paid";case"POST_PAID":return"Post-paid";default:return e}}})});