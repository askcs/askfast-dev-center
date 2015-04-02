describe('the developer page',function () {
	'use strict'

	var auth 					= require('../authActions.js');

	//navbar
	var developerbutton 			= element(By.linkText('DEVELOPER TOOLS'))

	//debugger
	var useLogs					= element(by.exactRepeater('log in logs'))

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
			return browser.isElementPresent(useLogbutton)
		})
		useLogbutton.click()
	})
	
	it('should show some logs ',function(){
		browser.wait(function(){
			return browser.isElementPresent(useLogs)
		})
		
		//the logs are visible
		expect(true).toBe(true);
	})

})