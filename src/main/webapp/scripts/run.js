define(["app","localization","config"],function(e,t,n){e.run(["$rootScope","$location","Offline","Session",function(e,r,i,s){new i,e.$on("connection",function(){arguments[1]?console.log("connection lost :["):console.log("connection restored")}),e.app=e.app||{},e.setLanguage=function(n){e.app.language=n,e.ui=t.ui[n]},e.setLanguage(n.app.defaults.language),e.config=n.app,e.$on("$routeChangeStart",function(){}),e.$on("$routeChangeSuccess",function(){}),e.$on("$routeChangeError",function(){})}])});