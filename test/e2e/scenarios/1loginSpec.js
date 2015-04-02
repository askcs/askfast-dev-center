describe('The login page',function () {
	'use strict'
	
	browser.driver.manage().window().setSize(1600, 900);

	var env 	= require('../environment.js'),
		auth 	= require('../authActions.js');

	//login form
	var userNameInput  			= element(by.model('login.email'))
	var userPasswordInput		= element(by.model('login.password'))
	var loginButton				= element(by.buttonText('Login'))

	//alert
	var alertMessage			= element(By.className('panel-footer ')).element(By.className('text-danger'))

	//dashboard
	var acountIDField			= element(By.id('publicKey'))
	var logoutButton			= element(By.linkText('LOGOUT'))

	//Go to the homepage
	browser.get(env.ciUrl);

	beforeEach(function(){
  	});

	it('should not login a user with a bad password',function(){
		userNameInput.sendKeys(env.ciUsername)
		userPasswordInput.sendKeys(env.ciBadPass)
		loginButton.click()

		browser.wait(function(){
			return browser.isElementPresent(alertMessage)
		})
		expect(alertMessage.getText()).toMatch('Wrong username or password!')
	})

	it('should login',function(){
		userNameInput.clear()
		userPasswordInput.clear()
		userNameInput.sendKeys(env.ciUsername)
		userPasswordInput.sendKeys(env.ciPass)
		loginButton.click()

		 browser.wait(function() {
      		return browser.getCurrentUrl().then(function(url){
        		return /dashboard/.test(url);
      		});
    	});

		expect(true).toBe(true)
	})

	it('should log out',function(){
		logoutButton.click()

		browser.wait(function() {
      		return browser.getCurrentUrl().then(function(url){
        		return /login/.test(url);
      		});
    	});
	})
})