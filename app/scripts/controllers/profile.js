define(
  ['controllers/controllers', 'modals/askfast'],
  function (controllers, AskFast)
  {
    'use strict';

    controllers.controller ('profile',
      [
        '$scope', '$rootScope', 'AskFast', 'Session', 'Store',  
        function ($scope, $rootScope, AskFast, Session, Store )
        {
            AskFast.caller('info')
              .then(function (info)
				{
					Store('app').save({
                        user: info
                    });
				});
        }
      ]
    );
  }
);