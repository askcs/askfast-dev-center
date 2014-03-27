define ['services/services'], (services) ->

  'use strict'

  services.factory 'Session', [
    '$http'
    '$cookieStore'
    'Store'
    ($http, $cookieStore, Store) ->

      Store = Store('session')

      return (

        # Check the session
        get: ->
          session = @cookies.get()
          if session
            @set session.id
            return session
          else
            false

        # Cookies
        cookies:

          # Cookie age in days
          age: 14

          # Set cookie
          set: (session) ->
            date = new Date()
            date.setTime date.getTime() + (@age * 24 * 60 * 60 * 1000)
            expires = "; expires=" + date.toGMTString()
            value = session + expires + "; path=/"
            $cookieStore.put 'X-SESSION_ID', value
            # For the case where backend has trouble parsing it
            # document.cookie = 'X-SESSION_ID=' + session
            return

          # Get cookie
          get: () ->
            cookie.split(';')[0] if cookie = $cookieStore.get 'X-SESSION_ID'

        # Set the session
        set: (id, log) ->
          session = { id: id }
          session.inited = new Date().getTime() if log
          Store.save info: session
          @cookies.set session.id
          $http.defaults.headers.common['X-SESSION_ID'] = session.id
          session

        # Clear the session
        clear: ->
          $cookieStore.remove 'X-SESSION_ID'
          $http.defaults.headers.common['X-SESSION_ID'] = null
          return
      )
  ]
  return