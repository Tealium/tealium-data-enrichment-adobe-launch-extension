'use strict';
var window = require('@adobe/reactor-window');
var loadScript = require('@adobe/reactor-load-script');
var extensionSettings = turbine.getExtensionSettings(),
  log = turbine.logger.log,
  localStoragePrefix = "teal_adbe_",
  validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-';

// Automatically adds a prefix to all items written to Local Storage
function writeLocalStorage(key, value) {
    log('Writing to LS:' + localStoragePrefix + key + ' = ' + value);
    window.localStorage.setItem(localStoragePrefix + key, value);
}

function getVisitorId(cookieName) {
    var tealCookie = window._satellite.cookie.get('TEAL');

    log('TEAL cookie:', tealCookie);

    // Future: Allow visitor id from a different cookie
    if (cookieName) {
        return window._satellite.cookie.get(cookieName);
    } else if (tealCookie === undefined) {
        log('Error: No visitor id cookie found');
    }

    // v:71776a3f4d2879538359591572952d25287239f1fb0$t:1612397069419$s:1612395269418;exp-sess$sn:1$en:1
    var temp = tealCookie.split('$');
    for (var i = 0; i < temp.length; i += 1) {
        if (temp[i].indexOf('v:') === 0) {
            return temp[i].substring(2);
        }
    }

    return '';
}

// Used in the clean function to make sure the visitor id is not strange
// Allowing: a-z, A-Z, 0-9, and . - 
function isValidChar(c) {
    var char = c.toString();
    if (validChars.indexOf(char) > -1) {
      return true;
    }

    log('Invalid or unexpected character found:' + c);
    return false;
}

function clean(str) {
    var newStr = '';
    for (var i = 0; i < str.length; i += 1) {
        if (isValidChar(str.charAt(i))) {
            newStr += str.charAt(i);
        }
    }

    return newStr;
}

// Global function for JSONP
window['tealium_adobe_enrich'] = function(o) {
    // Uses the prefix to write out teal_adb_enrichment_data to Local Storage
    var str = JSON.stringify(o);
    if (str !== "{}" && str !=="") {
        writeLocalStorage('enrichment_data', str);
    }
};

log('Tealium Data Enrichment extension settings: ( ' + JSON.stringify(extensionSettings) + ')');

module.exports = function(settings, event) {

  if (window._satellite.cookie.get('TEAL') === undefined && (extensionSettings.cookieName === undefined || extensionSettings.cookieName === '')) {
    log('No cookie found: may be running before Tealium Collect?');
    return;
  }

  var endpoint = extensionSettings.endpoint || 'https://visitor-service.tealiumiq.com',
    account = extensionSettings.account,
    profile = extensionSettings.profile || 'main',
    visitorId = clean(getVisitorId(extensionSettings.cookieName)),
    timestamp = new Date().getTime(),
    url = encodeURI(endpoint + '/' + account + '/' + profile + '/' + visitorId + '?callback=tealium_adobe_enrich&rnd=' + timestamp);
  
  log(url);
  if (visitorId) {
    loadScript(url).then(function(){
      // Using JSONP: global function 'tealium_adobe_enrich' will write data to Local Storage when data returned
      log('Completed');
    });
  }

};

