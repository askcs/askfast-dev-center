describe('The dashboard page',function () {
	'use strict'

	var env 	= require('../environment.js'),
		auth 	= require('../authActions.js');

	//Api key widget
	var acountIDField			= element(By.id('publicKey'))

	//nav bar
	var dashboardButoon 		= element(By.linkText('DASHBOARD'))

	beforeEach(function(){
		browser.getLocationAbsUrl()
			.then(function(result) {
				console.log(result)
					//check if the person is logged in
				if (result.indexOf('login') < 1) {
					//user is logged on go to the dashboard
					console.log('user is logged in')
				} else {
					//user is not logged on login user
					console.log('user is not logged in')
					auth.login()
				}

			})
		browser.waitForAngular()
		browser.wait(function() {
			return browser.isElementPresent(dashboardButoon)
		})
		dashboardButoon.click()
	})

	it('should show all widgets',function(){
		browser.sleep(60000)
	})
})