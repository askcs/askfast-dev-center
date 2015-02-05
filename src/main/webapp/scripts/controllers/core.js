define(["controllers/controllers"],function(e){e.controller("core",["$rootScope","$scope","AskFast","Store","Moment",function(e,t,n,r,i){function s(e){t.Dialog.open(e)}r=r("data"),t.currentSection="debugger",t.loading={logs:!0},t.setSection=function(e){t.currentSection=e},t.types=["Phone","SMS","Gtalk","Email","Twitter"],t.adapterTypes={broadsoft:{label:"Phone",ids:[]},voxeo:{label:"Phone",ids:[]},xmpp:{label:"Gtalk",ids:[]},email:{label:"Email",ids:[]},twitter:{label:"Twitter",ids:[]},sms:{label:"SMS",ids:[]}},t.channel={type:null,adapter:null},t.forms={},t.candidates=[],t.channelTypeSelected=function(){var e=[];angular.forEach(t.adapterTypes,function(n){n.label==t.channel.type&&angular.forEach(n.ids,function(n){angular.forEach(t.adapters,function(t){t.configId==n&&e.push(t)})})}),t.candidates=e},t.resetAdapterMenu=function(){t.channel.type=null,t.channel.adapter=null},t.query={type:"ALL",severity:"ALL",ddr:!1,limit:100,until:i().format("DD/MM/YYYY")},t.Log={data:null,list:function(e){var r=e?e:i().endOf("day").valueOf();t.loading.logs=!0,n.caller("log",{limit:t.query.limit,end:r}).then(function(e){var n={DDR:[],INFO:[],SEVERE:[],WARNING:[]};angular.forEach(e,function(e){angular.forEach(t.adapters,function(t){t.configId==e.adapterID&&(e.myAddress=t.myAddress,e.adapterType=t.adapterType)}),n[e.level]&&n[e.level].push(e)}),this.data=n,this.categorize(),this.severity(),t.loading.logs=!1}.bind(this))},categorize:function(){var e;switch(t.query.type){case"GTALK":e="xmpp";break;case"TWITTER":e="twitter";break;case"PHONE":e="broadsoft";break;case"SMS":e="sms";break;case"EMAIL":e="email"}var n=[];angular.forEach(this.data,function(t){angular.forEach(t,function(t){t.adapterType==e?n.push(t):angular.isUndefined(e)&&n.push(t)})}),t.logs=n},severity:function(){switch(t.query.severity){case"ALL":var e=[],n=this.data;t.query.ddr||delete n.DDR,angular.forEach(n,function(t){angular.forEach(t,function(t){e.push(t)})}),t.logs=e;break;default:t.logs=this.data[t.query.severity]}},period:function(){this.list(i(t.query.until,"DD/MM/YYYY").endOf("day").valueOf())}},t.$watch("query.ddr",function(){t.Log.list()}),t.Log.list(),t.Adapter={list:function(e){t.adapterType="",n.caller("getAdapters").then(function(n){angular.forEach(n,function(e){if(e.adapterType in t.adapterTypes){var n=t.adapterTypes[e.adapterType].ids;n.indexOf(e.configId)==-1&&n.push(e.configId)}}),r.save(t.adapterTypes,"adapterTypes"),t.adapters=n,e&&e.call(null,n)})},add:function(e){n.caller("createAdapter",{second:e.configId}).then(function(){this.list()}.bind(this))},query:function(e){n.caller("freeAdapters",{adapterType:e}).then(function(e){t.freeAdapters=e})},remove:function(e){n.caller("removeAdapter",{second:e.configId}).then(function(){this.list()}.bind(this))}},t.Adapter.list(),t.Dialog={list:function(e){n.caller("getDialog").then(function(n){t.dialogs=n,e&&e.call()})},add:function(e){e.form.name&&e.form.url&&n.caller("createDialog",null,{name:e.form.name,url:e.form.url}).then(function(e){t.addingDialog=!1,this.list(function(){t.setSection("dialogs"),s(e)})}.bind(this))},remove:function(e){n.caller("deleteDialog",{third:e.id}).then(function(){t.addingDialog=!1,this.list(function(){t.dialog=null,t.dialogs[0]&&(t.dialog=t.dialogs[0]),t.setSection("dialogs")})}.bind(this))},update:function(e){n.caller("updateDialog",{third:e.id},{id:e.id,name:e.name,url:e.url,owner:e.owner}).then(function(e){this.list()}.bind(this))},adapters:{list:function(e,n){var r=[];return angular.forEach(t.adapters,function(t){n&&n.id==t.id?r.push(n):t.dialogId==e&&r.push(t)}),r},update:function(e,r){n.caller("updateAdapter",{second:r},{dialogId:e}).then(function(e){t.Adapter.list()}.bind(this))},add:function(e){this.update(e.id,t.channel.adapter),t.resetAdapterMenu(),t.candidates=[],s(e)},remove:function(e){this.update("",e.configId)}},open:function(e){t.dialog=angular.copy(e),angular.isDefined(t.forms.details)&&(t.forms.details.$setPristine(),this.adapters.list(e.id)&&(t.dialogAdapters=this.adapters.list(e.id)))}},t.Dialog.list(function(){t.dialogs.length>0&&t.Dialog.open(t.dialogs[0])})}])});