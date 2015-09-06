function ga_configure(onServiceCallback) {
  var el = document.createElement('script');
  el.src = 'assets/scripts/google-analytics-bundle.js';
  document.head.appendChild(el);
  el.onload = function() {
    console.log('Loaded Google Analytics bundle.');
    var service = analytics.getService('atc_app');
    onServiceCallback(service);
  };
}

function ga_create_tracker(service) {
  service.getConfig().addCallback(function(config) {
    var trackingPermitted = config.isTrackingPermitted();
    console.log('Google Analytics tracking is ' + (trackingPermitted ?
                                                   'enabled' :
                                                   'disabled') + '.');
  });
  var ga_tracker = service.getTracker('UA-67244241-1');
  ga_tracker.set('appVersion', chrome.runtime.getManifest()['version']);
  return ga_tracker;
}