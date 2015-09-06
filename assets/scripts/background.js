chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    'state': 'fullscreen',
    'singleton': true
  });
});

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: 'atc-app-options',
    title: 'Options',
    contexts: ['launcher']
  });
});

chrome.contextMenus.onClicked.addListener(function(info) {
  if (info.menuItemId == 'atc-app-options') {
    chrome.app.window.create('chrome_app_options.html', {}, function(w) {
      w.contentWindow.onload = function(e) {
        var optionsWindow = e.currentTarget;
        var optionsDoc = e.target;
        
        optionsWindow.ga_configure(function(service) {
          service.getConfig().addCallback(function(config) {
            var gaTrackingCheckbox = optionsDoc.getElementById('ga-tracking');
            gaTrackingCheckbox.checked = config.isTrackingPermitted();
            gaTrackingCheckbox.disabled = false;
            
            gaTrackingCheckbox.onchange = function() {
              config.setTrackingPermitted(gaTrackingCheckbox.checked);
            };
          });
          
          var gaTracker = optionsWindow.ga_create_tracker(service);
          gaTracker.sendAppView('options');
        });
      };
    });
  }
});