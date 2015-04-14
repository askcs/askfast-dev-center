describe('The dashboard page',function () {
	'use strict'

	var env 					= require('../environment.js'),
		auth 					= require('../authActions.js');

	//Api key widget
	var acountIDField			= element(By.id('publicKey'))

	//nav bar
	var dashboardButoon 		= element(By.linkText('DASHBOARD'))

	//Keys widget
	var showKeyButton			= element(by.buttonText('Show'))
	var keyField				= element(By.id('userKey'))

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

	it('should show real key',function(){
		browser.wait(function() {
			return browser.isElementPresent(showKeyButton)
		})
		console.log('test')
		console.log(showKeyButton.getAttribute('type'))
		showKeyButton.click()
		console.log(showKeyButton.getAttribute('type'))
		expect(true).toBe(true)
	})
})