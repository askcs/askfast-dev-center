define(["controllers/controllers","modals/askfast"],function(e,t){e.controller("login",["$scope","$rootScope","AskFast","Session","Store","$location","MD5",function(e,t,n,r,i,s,o){i=i("app"),e.login={email:"",password:"",validation:{email:!1,password:!1},error:{state:!1,code:null},state:!1};var u=angular.element("#login button[type=submit]"),a=i.get("login");a&&a.remember&&(e.login.email=a.email,e.login.password=a.password,e.login.remember=a.remember),e.auth=function(){u.text("Login..").attr("disabled","disabled"),i.save({login:{email:e.login.email,password:e.login.password,remember:e.login.remember}}),n.caller("login",{username:e.login.email,password:o(e.login.password)},null,{success:function(o){o.hasOwnProperty("X-SESSION_ID")&&(e.login.error={state:!1,code:null},r.set(o["X-SESSION_ID"]),e.login.state=!0,n.caller("info").then(function(e){i.save({user:e}),t.user=e,s.path("/dashboard")}))},error:function(t){[400,403,404,500].indexOf(t.status)>=0&&(console.log("falling in"),e.login.error={state:!0,code:t.status},console.warn("login error ->",e.login.error),u.text("Login").removeAttr("disabled"))}})}}])});