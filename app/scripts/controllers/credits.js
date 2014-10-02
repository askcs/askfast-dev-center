define(
  ['controllers/controllers', 'modals/askfast'],
  function (controllers, AskFast)
  {
    'use strict';

    controllers.controller ('credits',
      [
        '$scope', '$rootScope', 'AskFast', 'Session', 'Store',  
        function ($scope, $rootScope, AskFast, Session, Store )
        {
            AskFast.caller('info')
              .then(function (info)
				{
					console.log(info);
					Store('app').save({
                        user: info
                    });
				});
			AskFast.caller('ddr')
              .then(function (ddr)
				{
					console.log(ddr);
					$scope.logs = ddr;
				});
        }
      ]
    );
  }
);