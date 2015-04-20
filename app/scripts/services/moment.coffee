define ['services/services', 'moment'], (services, moment) ->

  'use strict'

  services.factory 'moment', [
    ->
      moment
  ]
  return