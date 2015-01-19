define(['directives/directives'], function (directives){
  'use strict';

  function filterInfoByTag (targetArray, typeString){
    return targetArray.filter(function(infoObject){
            if (infoObject.contactInfoTag === typeString &&
                infoObject.verified === true) {
              return true;
            }
            else {
              return false;
            }
          });
  }

  directives.directive('userContact', function () {
    return {
      restrict: 'A',
      scope: {
        type: '@',
        userContact: '='
      },
      link: function (scope, element, attrs) {
        var filtered;

        if (scope.userContact) {
          filtered = filterInfoByTag(scope.userContact, scope.type);

          if (filtered.length === 1){
            element.html(filtered[0].contactInfo);
          }
          else if (filtered.length === 0) {
            switch (scope.type){
              case 'PHONE':
                element.text("No verified phone number found.");
                break;
              case 'EMAIL':
                element.text("No verified email address found.")
            }
          }
          else {
            // TODO: Handle multiple phone numbers, emails
          }
        } // end if (scope.userContact)

      }
    };

  });
});