/*jslint browser: true, devel: true, nomen: true */

(function () {
    'use strict';
    
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
        title: "Show Saved Notes...",
        contexts: ["page_action"],
        onclick: function () {
            chrome.tabs.create({ url: '/notes.html' });
        }
    });
    
    function notesChangedCallback() {
        // Do nothing.
    }
    
    var notesStorage = new WebStore(localStorage, 'note', notesChangedCallback),
        lastTabId = 0;

    function showToolbarButton(tab) {
        if (tab) {
            lastTabId = tab.id;
            chrome.pageAction.show(lastTabId);
            if (notesStorage.find("url", tab.url) !== -1) {
                chrome.pageAction.setIcon({ path: "icons.iconarchive.com/icons/fatcow/farm-fresh/16/note-edit-icon.png", tabId: tab.id });
            } else {
                chrome.pageAction.setIcon({ path: "icons.iconarchive.com/icons/fatcow/farm-fresh/16/note-add-icon.png", tabId: tab.id });
            }
        }
    }
    
    
    // Fires when the active tab in a window changes. 
    // Note that the tab's URL may not be set at the time this event fired, but you can listen to onUpdated events to be notified when a URL is set.
    // https://developer.chrome.com/extensions/tabs#event-onActivated
    chrome.tabs.onActivated.addListener(function (activeInfo) {
        setTimeout(function () {
            chrome.tabs.get(activeInfo.tabId, function (tab) {
                showToolbarButton(tab);
            });
        }, 200);
    });
    
    // Fired when a tab is updated.
    // https://developer.chrome.com/extensions/tabs#event-onUpdated
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        showToolbarButton(tab);
    });
    
    // Gets all tabs that have the specified properties, or all tabs if no properties are specified.
    // https://developer.chrome.com/extensions/tabs#method-query
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        showToolbarButton(tabs[0]);
    });

}());
