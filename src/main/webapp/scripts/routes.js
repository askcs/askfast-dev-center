define(["app"],function(e){e.config(["$routeProvider",function(e){e.when("/home",{templateUrl:"views/home.html",controller:"home"}).when("/register",{templateUrl:"views/register.html",controller:"register",reloadOnSearch:!1}).when("/login",{templateUrl:"views/login.html",controller:"login"}).when("/logout",{templateUrl:"views/logout.html",controller:"logout"}).otherwise({redirectTo:"/home"})}])});