define(["directives/directives"],function(e){function t(e,t){return e.filter(function(e){return e.contactInfoTag===t&&e.verified===!0?!0:!1})}e.directive("userContact",function(){return{restrict:"A",scope:{type:"@",userContact:"="},link:function(e,n,r){var i;if(e.userContact){i=t(e.userContact,e.type);if(i.length===1)n.html(i[0].contactInfo);else if(i.length===0)switch(e.type){case"PHONE":n.text("No verified phone number found.");break;case"EMAIL":n.text("No verified email address found.")}}}}})});