define(["controllers/controllers","modals/askfast"],function(e,t){e.controller("register",["$scope","$rootScope","$location","AskFast",function(e,t,n,r){$("body").addClass("register-0"),e.data={user:{name:{first:"",last:"",full:function(){return this.first+" "+this.last}},email:"",phone:""},passwords:{first:"",second:""},verification:{id:null,code:null,resent:!1},agreed:!1,validation:{name:{first:!1,last:!1},email:!1,userExists:!1,passwords:!1,phone:!1},submitted:!1,error:{register:!1,resent:!1,verify:!1}},e.step={value:null,resolve:Number(n.hash().split("-")[1]),check:function(e){return this.value===e},validate:function(t){var n=!0;switch(t){case 1:e.data.submitted=!0,e.data.validation.name.first=e.data.user.name.first=="",e.data.validation.name.last=e.data.user.name.last=="",e.data.validation.email=e.data.user.email=="",e.data.validation.passwords=e.data.passwords.first==""||e.data.passwords.second==""||e.data.passwords.first!=e.data.passwords.second;if(e.data.validation.first||e.data.validation.last||e.data.validation.email||e.data.validation.userExists||e.data.validation.passwords)n=!1;break;case 2:break;case 3:break;default:}return n},forward:function(){var t=this.value;this.validate(t)&&(this.value=Number(t+1),n.hash("step-"+this.value)),e.data.verification.resent=!1,e.data.error.register=!1,e.data.error.resent=!1,e.data.error.verify=!1}},localStorage.hasOwnProperty("data.verification.id")&&(e.step.value=3,n.hash("step-3")),e.$watch("$location",function(){$("body").removeClass();switch(e.step.resolve){case 1:$("body").addClass("register-0");break;case 2:$("body").addClass("register-1");break;case 3:$("body").addClass("register-1");break;case 4:$("body").addClass("register-3")}}),e.step.value=e.step.resolve,e.register=function(){r.caller("register",{name:e.data.user.name.full(),username:e.data.user.email,password:e.data.passwords.first,phone:e.data.user.phone,verification:"SMS"}).then(function(t){t.hasOwnProperty("error")?e.data.error.register=!0:(e.data.verification.id=t.verificationCode,localStorage.setItem("data.verification.id",t.verificationCode))})};var i=500;e.userExists=function(){e.checkUsername&&(clearTimeout(e.checkUsername),e.checkUsername=null),e.checkUsername=setTimeout(function(){e.checkUsername=null,e.registrationForm1.email.$valid&&r.caller("userExists",{username:e.data.user.email}).then(function(t){e.data.validation.userExists=t.hasOwnProperty("error")})},i)},e.checkUsername=null,e.verify=function(){r.caller("registerVerify",{code:e.data.verification.code,id:localStorage.getItem("data.verification.id")}).then(function(n){n.hasOwnProperty("error")?(e.data.verification.resent=!1,e.data.error.verify=!0):(localStorage.removeItem("data.verification.id"),e.step.forward(),t.session=n["X-SESSION_ID"])})},e.resend=function(){r.caller("resendVerify",{code:localStorage.getItem("data.verification.id"),verification:"SMS"}).then(function(t){t.hasOwnProperty("error")?e.data.error.resent=!0:(e.data.verification.resent=!0,e.data.error.verify=!1)})}}])});