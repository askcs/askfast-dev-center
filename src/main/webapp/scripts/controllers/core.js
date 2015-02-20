define(["controllers/controllers"],function(e){e.controller("core",["$rootScope","$scope","$q","$timeout","AskFast","Store","Moment",function(e,t,n,r,i,s,o){function u(e){t.Dialog.open(e)}s=s("data"),t.currentSection="debugger",t.loading={logs:!0},t.setSection=function(e){t.currentSection=e},t.types=["Phone","SMS","Gtalk","Email","Twitter"],t.adapterTypes={call:{label:"Phone",ids:[]},xmpp:{label:"Gtalk",ids:[]},email:{label:"Email",ids:[]},twitter:{label:"Twitter",ids:[]},sms:{label:"SMS",ids:[]}},t.channel={type:null,adapter:null},t.forms={},t.candidates=[],t.channelTypeSelected=function(){var e=[];angular.forEach(t.adapterTypes,function(n){n.label==t.channel.type&&angular.forEach(n.ids,function(n){angular.forEach(t.adapters,function(t){t.configId==n&&e.push(t)})})}),t.candidates=e},t.dialogAuth={open:!1,message:"",messageType:""},t.resetAdapterMenu=function(){t.channel.type=null,t.channel.adapter=null},t.query={type:"ALL",severity:"ALL",ddr:!1,limit:100,until:o().format("DD/MM/YYYY")},t.Log={data:null,list:function(e){var n=e?e:o().endOf("day").valueOf();t.loading.logs=!0,i.caller("log",{limit:t.query.limit,end:n}).then(function(e){var n={DDR:[],INFO:[],SEVERE:[],WARNING:[]};angular.forEach(e,function(e){angular.forEach(t.adapters,function(t){t.configId==e.adapterID&&(e.myAddress=t.myAddress,e.adapterType=t.adapterType)}),n[e.level]&&n[e.level].push(e)}),this.data=n,this.categorize(),this.severity(),t.loading.logs=!1}.bind(this))},categorize:function(){var e;switch(t.query.type){case"GTALK":e="xmpp";break;case"TWITTER":e="twitter";break;case"PHONE":e="call";break;case"SMS":e="sms";break;case"EMAIL":e="email"}var n=[];angular.forEach(this.data,function(t){angular.forEach(t,function(t){t.adapterType==e?n.push(t):angular.isUndefined(e)&&n.push(t)})}),t.logs=n},severity:function(){switch(t.query.severity){case"ALL":var e=[],n=this.data;t.query.ddr||delete n.DDR,angular.forEach(n,function(t){angular.forEach(t,function(t){e.push(t)})}),t.logs=e;break;default:t.logs=this.data[t.query.severity]}},period:function(){this.list(o(t.query.until,"DD/MM/YYYY").endOf("day").valueOf())}},t.$watch("query.ddr",function(){t.Log.list()}),t.Log.list(),t.Adapter={list:function(e){t.adapterType="",i.caller("getAdapters").then(function(n){angular.forEach(n,function(e){if(e.adapterType in t.adapterTypes){var n=t.adapterTypes[e.adapterType].ids;n.indexOf(e.configId)==-1&&n.push(e.configId)}}),s.save(t.adapterTypes,"adapterTypes"),t.adapters=n,e&&e.call(null,n)})},add:function(e){i.caller("createAdapter",{second:e.configId}).then(function(){this.list()}.bind(this))},query:function(e){i.caller("freeAdapters",{adapterType:e}).then(function(e){t.freeAdapters=e})},remove:function(e){i.caller("removeAdapter",{second:e.configId}).then(function(){this.list()}.bind(this))}},t.Adapter.list(),t.Dialog={list:function(e){i.caller("getDialog").then(function(n){t.dialogs=n,e&&e.call()})},add:function(e){e.form.name&&e.form.url&&i.caller("createDialog",null,{name:e.form.name,url:e.form.url}).then(function(e){t.addingDialog=!1,this.list(function(){t.setSection("dialogs"),u(e),t.dialogAuth=!1})}.bind(this))},remove:function(e){i.caller("deleteDialog",{third:e.id}).then(function(){t.addingDialog=!1,this.list(function(){t.dialog=null,t.dialogs[0]&&(t.dialog=t.dialogs[0]),t.setSection("dialogs")})}.bind(this))},update:function(e,t){var n={id:e.id,name:e.name,url:e.url,owner:e.owner};angular.isDefined(e.userName)&&angular.isDefined(e.password)&&angular.isDefined(e.useBasicAuth)&&(n.userName=e.userName,n.password=e.password,n.useBasicAuth=e.useBasicAuth),i.caller("updateDialog",{third:e.id},n).then(function(e){t&&(e.error?t.reject(e):t.resolve(e)),this.list()}.bind(this))},updateDetails:function(e){var n=t.dialogs.filter(function(t){return t.id===e.id?!0:!1});e.userName=n[0].userName,e.password=n[0].password,this.update(e)},adapters:{list:function(e,n){var r=[];return angular.forEach(t.adapters,function(t){n&&n.id==t.id?r.push(n):t.dialogId==e&&r.push(t)}),r},update:function(e,n){i.caller("updateAdapter",{second:n},{dialogId:e}).then(function(e){t.Adapter.list()}.bind(this))},add:function(e){this.update(e.id,t.channel.adapter),t.resetAdapterMenu(),t.candidates=[],u(e)},remove:function(e){this.update("",e.configId)}},open:function(e){t.dialog=angular.copy(e),t.Dialog.authentication.notify(null,null,!0),angular.isDefined(t.forms.details)&&(t.forms.details.$setPristine(),this.adapters.list(e.id)&&(t.dialogAdapters=this.adapters.list(e.id)))},authentication:{enable:function(e){if(!e.userName||!e.password){this.notify("Please fill in both a Username and a Password","warning");return}e.useBasicAuth=!0;var r=t.dialogs.filter(function(t){return t.id===e.id?!0:!1});e.name=r[0].name,e.url=r[0].url;var i=n.defer();t.Dialog.update(e,i),i.promise.then(function(e){t.dialogAuth.open=!1,this.notify("Basic Authentication applied successfully","success")}.bind(this)).catch(function(e){console.log("error -> ",e),this.notify("Something went wrong with the request","danger")}.bind(this))},disable:function(e){var r;e.useBasicAuth=!1;var i=t.dialogs.filter(function(t){return t.id===e.id?!0:!1});e.name=i[0].name,e.url=i[0].url,r=angular.copy(e),r.userName=null,r.password=null;var s=n.defer();t.Dialog.update(r,s),s.promise.then(function(e){t.dialogAuth.open=!1,this.notify("Basic Authentication successfully disabled","success")}.bind(t.Dialog.authentication)).catch(function(e){console.log("error -> ",e),this.notify("Something went wrong with the request","danger")}.bind(t.Dialog.authentication))},notify:function(e,n,i){i&&(t.dialogAuth.message=""),t.dialogAuth.message=e,t.dialogAuth.messageType=n,t.authNotifyTimeoutPromise&&r.cancel(t.authNotifyTimeoutPromise),t.authNotifyTimeoutPromise=r(function(){t.dialogAuth.message=""},6e3)},cancel:function(e){var n=t.dialogs.filter(function(t){return t.id===e.id?!0:!1});t.dialog.userName=n[0].userName,t.dialog.password=n[0].password,t.dialogAuth.open=!1,t.forms.auth.$setPristine()}}},t.authenticateDialog=function(e){t.Dialog.authentication.enable(e)},t.disableDialogAuthentication=function(e){t.Dialog.authentication.disable(e)},t.cancelAuthentication=function(e){t.Dialog.authentication.cancel(e)},t.Dialog.list(function(){t.dialogs.length>0&&t.Dialog.open(t.dialogs[0])})}])});