'use strict'

var env = require('./environment.js')

//login form
var userNameInput  			= element(by.model('login.email'))
var userPasswordInput		= element(by.model('login.password'))
var loginButton				= element(by.buttonText('Login'))

//dashboard
var acountIDField			= element(By.id('publicKey'))

module.exports = {

	login: function login () {


		userNameInput.sendKeys(env.ciUsername)
		userPasswordInput.sendKeys(env.ciPass)
		loginButton.click()

		console.log('Logging in ')

		browser.wait(function(){
			return browser.driver.getCurrentUrl().then(function(url){
        		return /dashboard/.test(url);
        	})
		})


	},

	logout: function logout (){

	},

	badLoginAttempt: function badLoginAttempt(){

	}

}