define(["controllers/controllers","modals/askfast"],function(e,t){e.controller("login",["$scope","$rootScope","AskFast","Session","Storage","Store",function(e,t,n,r,i,s){e.login={email:"",password:"",validation:{email:!1,password:!1},error:{state:!1,code:null},state:!1};var o=$("#login button[type=submit]");i.session.get("app")||i.session.add("app","{}");var u=angular.fromJson(i.get("login"));u&&u.remember&&(e.login.email=u.email,e.login.password=u.password,e.login.remember=u.remember),e.auth=function(){o.text("Login..").attr("disabled","disabled"),i.add("login",angular.toJson({email:e.login.email,password:e.login.password,remember:e.login.remember})),n.login(e.login).then(function(t){[400,403,404,500].indexOf(t.status)<0&&(e.login.error={state:!0,code:t.status},o.text("Login").removeAttr("disabled")),t.hasOwnProperty("X-SESSION_ID")&&(e.login.error={state:!1,code:null},r.set(t["X-SESSION_ID"]),e.login.state=!0)})}}])});