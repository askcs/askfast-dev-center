define ['services/services'], (services) ->
  # Not used, for reference only, use .js instead
  'use strict'

  services.factory 'Session', [
    '$http'
    'Store'
    ($http, Store) ->

      Store = Store('session')

      return (

        # Check the session
        get: ->
          session = Store.get 'info'
          session.id

        # Set the session
        set: (id) ->
          session = { id: id }
          session.inited = new Date().getTime()
          Store.save info: session
          $http.defaults.headers.common['X-SESSION_ID'] = session.id
          session

        #set auth header
        auth: (bearer)->
          $http.defaults.headers.common['Authorization'] = bearer

        #set content type
        setHeader: (type)->  
          $http.defaults.headers.post['Content-Type'] = type

      # Clear the session
        clear: ->
          Store.remove 'info'
          $http.defaults.headers.common['X-SESSION_ID'] = null
          return
      )
  ]
  return