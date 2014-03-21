define ["services/services"], (services) ->

  "use strict"

  services.factory "Session", [
    "$rootScope"
    "$http"
    "Store"
    ($rootScope, $http, Store) ->

      Store = Store("session")

      return (


        # Check the session
        check: ->
          session = angular.fromJson(Storage.cookie.get("session"))
          if session
            @set session.id
            true
          else
            false


        # Get the current session if exists
        get: (session) ->
          @check session
          @set session.id
          session.id


        # Set the session
        set: (id) ->
          session = session:
            id: id

          Store.save session
          $rootScope.session = session
          $http.defaults.headers.common["X-SESSION_ID"] = session.id
          session


        # Clear the session
        clear: ->
          $rootScope.session = null
          $http.defaults.headers.common["X-SESSION_ID"] = null
          return
      )
  ]
  return