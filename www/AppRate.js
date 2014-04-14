// Generated by CoffeeScript 1.7.1
var AppRate, channel, locales, preferences;

preferences = require("./preferences");

locales = require("./locales");

channel = require("cordova/channel");

AppRate = (function() {
  var getLocaleObject, navigateToAppStore, promptForRatingWindowButtonClickHandler, rate_reset, rate_stop, rate_try, thisObj;

  thisObj = AppRate;

  AppRate.rate_app = parseInt(window.localStorage.getItem("rate_app") || 1);

  AppRate.usesUntilPromptCounter = parseInt(window.localStorage.getItem("usesUntilPromptCounter") || 0);

  function AppRate() {
    if (preferences.promptAtLaunch === true) {
      channel.onCordovaReady.subscribe(function() {
        return AppRate.prototype.promptForRating();
      });
    }
  }

  navigateToAppStore = function() {
    if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent.toLowerCase())) {
      return window.open("http://itunes.apple.com/app/id" + preferences.appStoreID.ios);
    } else if (/(Android)/i.test(navigator.userAgent.toLowerCase())) {
      return window.open("market://details?id=" + preferences.appStoreID.android, "_system");
    } else if (/(BlackBerry)/i.test(navigator.userAgent.toLowerCase())) {
      return window.open("http://appworld.blackberry.com/webstore/content/" + preferences.appStoreID.blackberry);
    }
  };

  promptForRatingWindowButtonClickHandler = function(buttonIndex) {
    switch (buttonIndex) {
      case 3:
        rate_stop();
        return setTimeout(navigateToAppStore, 1000);
      case 2:
        return rate_reset();
      case 1:
        return rate_stop();
    }
  };

  rate_stop = function() {
    window.localStorage.setItem("rate_app", 0);
    return window.localStorage.removeItem("usesUntilPromptCounter");
  };

  rate_reset = function() {
    return window.localStorage.setItem("usesUntilPromptCounter", 0);
  };

  rate_try = function() {
    var localeObj;
    localeObj = getLocaleObject();
    if (thisObj.usesUntilPromptCounter === preferences.usesUntilPrompt && thisObj.rate_app !== 0) {
      return navigator.notification.confirm(localeObj.message, promptForRatingWindowButtonClickHandler, localeObj.title, localeObj.buttonLabels);
    } else if (thisObj.usesUntilPromptCounter < preferences.usesUntilPrompt) {
      thisObj.usesUntilPromptCounter++;
      return window.localStorage.setItem("usesUntilPromptCounter", thisObj.usesUntilPromptCounter);
    }
  };

  getLocaleObject = function() {
    var displayAppName, key, localeObj, value;
    localeObj = locales[preferences.useLanguage] || locales["en"];
    displayAppName = localeObj.displayAppName || preferences.displayAppName;
    for (key in localeObj) {
      value = localeObj[key];
      if (typeof value === 'string' || value instanceof String) {
        localeObj[key] = value.replace(/%@/g, displayAppName);
      }
    }
    return localeObj;
  };

  AppRate.prototype.promptForRating = function() {
    if (navigator.notification && navigator.globalization) {
      return navigator.globalization.getPreferredLanguage(function(language) {
        preferences.useLanguage = language.value.split(/_/)[0];
        return rate_try();
      }, function() {
        return rate_try();
      });
    }
  };

  return AppRate;

})();

module.exports = new AppRate(this);
