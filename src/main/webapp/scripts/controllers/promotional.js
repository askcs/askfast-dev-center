define(["controllers/controllers"],function(e){e.controller("promotional",["$rootScope","$scope",function(e,t){t.setChannelView=function(e){t.channelView={tel:!1,mail:!1,twitter:!1,email:!1,gMail:!1},t.channelView[e]=!0},t.setPromiseView=function(e){t.promiseView={cost:!1,analyze:!1,time:!1,customizable:!1,integration:!1,cloud:!1,ideas:!1,performance:!1,privacy:!1},t.promiseView[e]=!0},t.switchDevMod=function(e){t.devModView={verify:!1,broadcast:!1,tracking:!1,click:!1},t.devModView[e]=!0},t.setChannelView("tel"),t.setPromiseView("cost"),t.switchDevMod("verify")}])});