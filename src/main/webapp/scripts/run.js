define(["app","localization","config"],function(e,t,n){e.run(["$rootScope","$location",function(e,r){e.app=e.app||{},e.setLanguage=function(n){e.app.language=n,e.ui=t.ui[n]},e.setLanguage(n.app.defaults.language),e.config=n.app,e.setMainView=function(t){e.config.app.nav.subs[t]?(r.path(t).hash(e.config.app.nav.subs[t][0]),e.setSubView(e.config.app.nav.subs[t][0])):r.path(t),e.collapseMenu()},e.collapseMenu=function(){$(".navbar .in").length>0&&$(".navbar .navbar-collapse").removeClass("in").addClass("collapse")};var i=[];angular.forEach(e.config.app.nav.subs,function(e){angular.forEach(e,function(e){i.push(e)})}),e.subView={},e.setSubView=function(t){angular.forEach(i,function(t){e.subView[t]=!1}),r.hash(t),e.subView[t]=!0},e.contact={},e.redirectTo=function(t,n){r.path(t).hash(n),e.setSubView(n),window.scrollTo(0,0),e.contact.subject.sales=!0},r.hash()&&e.setSubView(r.hash()),e.location={},e.home={reference:{}};var s=0,o=e.ui.pages.home.references.length;e.home.reference=e.ui.pages.home.references[s],setInterval(function(){s=s===o-1?0:s+1,e.home.reference=e.ui.pages.home.references[s],e.$apply()},1e4),e.isInternPage=function(){var e=["/login","/register"];return e.indexOf(r.path())>=0},e.$on("$routeChangeStart",function(){}),e.$on("$routeChangeSuccess",function(){}),e.$on("$routeChangeError",function(){})}])});