function browser_init_pre() {
  log("Performing browser-specific initialization...");
  if (window.chrome && chrome.runtime && chrome.runtime.id) {
    // Running in a context of a Chrome App, use sync storage.
    prop.storage = {};
    
    // Chrome Storage API is asynchronous, which is a pain when retrofitting it
    // into an existing codebase that uses synchronous LocalStorage API.
    //
    // So we simulate the synchronous API by keeping a cache of the values and
    // observing the changes to it and updating the underlying storage as
    // needed.
    chrome.storage.sync.get(null, function(results) {
      if (chrome.runtime.lastError) {
        console.error('Failed to get settings from Chrome Sync storage:',
            chrome.runtime.lastError);
      } else {
        log('Successfully loaded settings from Chrome Sync storage.');
        Object.keys(results).forEach(function(k) {
          prop.storage[k] = results[k];
        });
      }
      Object.observe(prop.storage, function(changes) {
        var items = {};
        var deletedItems = {};
        changes.forEach(function(change) {
          if (change.type === 'add' || change.type === 'update') {
            items[change.name] = prop.storage[change.name];
            // If we were deleting the item, we need to forget about that.
            delete deletedItems[change.name];
          } else if (change.type === 'delete') {
            deletedItems[change.name] = true;
            // If we were setting the item, we need to forget about that.
            delete items[change.name];
          } else {
            // Unsupported change type, ignored.
          }
        }, ['add', 'update', 'delete']);

        if (Object.keys(items).length > 0) {
          chrome.storage.sync.set(items);
        }
        if (Object.keys(deletedItems).length > 0) {
          chrome.storage.sync.remove(Object.keys(deletedItems));
        }
      });
    });

    RELEASE = true;
    prop.log = LOG_WARNING;
    
    ga_configure(function(service) {
      prop.ga_tracker = ga_create_tracker(service);
      prop.ga_tracker.sendEvent('Lifecycle', 'startup');
    });
  } else {
    prop.storage = window.localStorage;
  }
}
