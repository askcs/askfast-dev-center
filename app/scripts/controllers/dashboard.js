define(
  ['controllers/controllers', 'modals/askfast'],
  function (controllers, AskFast)
  {
    'use strict';

    controllers.controller ('dashboard',
      [
        '$scope', '$rootScope', 'AskFast', 'Session', 'Store',  
        function ($scope, $rootScope, AskFast, Session, Store )
        {
            AskFast.caller('info')
              .then(function (info)
				{
					AskFast.caller('key')
						.then(function (keys)
					{
						info.refreshToken = keys.refreshToken;
					});
					Store('app').save({
                        user: info
                    });
				});
			
			
        }
      ]
    );
  }
);