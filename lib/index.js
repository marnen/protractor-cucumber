var protractor = require('protractor')
, webdriver = require('selenium-webdriver')
, chrome = require('selenium-webdriver/chrome');

var World = (function(seleniumAddress, options) {

  var directConnect = !seleniumAddress;
  var browserOpt = options.browser || "chrome";
  delete options.browser;
  var timeout = options.timeout || 100000;
  delete options.timeout;

  function World(callback) {
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities[browserOpt]().merge(options));
    if (!directConnect) {
      driver = driver.usingServer(seleniumAddress);
    }
    driver = driver.build();

    driver.manage().timeouts().setScriptTimeout(timeout);

    var winHandleBefore;

    driver.getWindowHandle().then(function(result){
      winHandleBefore = result;
    });

    this.browser = protractor.wrapDriver(driver);
    this.protractor = protractor;
    this.by = protractor.By;

    if (options.assert) this.assert = options.assert;
    if (options.baseUrl) this.baseUrl = options.baseUrl;
    if (options.properties) this.properties = options.properties;

    callback();

    this.quit = function(callback){
      driver.quit().then(function(){
        callback();
      });
    }
  }

  return World;
});

module.exports.world = World;