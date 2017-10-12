(function () {
    'use strict';
    
    // https://stackoverflow.com/a/9310752/2289640
    function escapeRegExp(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
    
    function makeQuery(text) {
        return '^' + escapeRegExp(text) + '$';
    }
    
    function setNote(notesStorage, tabUrl, noteText) {
        var nowDate = (new Date()).getTime(),
            page,
            pageIdx = notesStorage.find("url", makeQuery(tabUrl));
        
        if (pageIdx !== -1) {
            page = notesStorage.getRecordByIndex(pageIdx);
            page.udate = nowDate;
            page.note = noteText;
            notesStorage.updateRecord(page);
            return false; // При обновлении возвращаем FALSE.
        } else {
            page = notesStorage.createRecord({
                url: tabUrl,
                note: noteText,
                cdate: nowDate,
                udate: nowDate
            });
            return true; // При создании возвращаем TRUE.
        }
    }
    
    function getNote(notesStorage, tabUrl) {
        var nowDate = (new Date()).getTime(),
            page,
            pageIdx = notesStorage.find("url", makeQuery(tabUrl));
        
        if (pageIdx !== -1) {
            page = notesStorage.getRecordByIndex(pageIdx);
            return page;
        } else {
            return {
                url: tabUrl,
                note: "",
                cdate: nowDate,
                udate: nowDate
            };
        }
    }
    
    function notesChangedCallback() {
        // Do nothing.
    }
    
    function save(notesStorage, noteText) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (setNote(notesStorage, tabs[0].url, noteText)) {
                chrome.pageAction.setIcon({ path: "icons.iconarchive.com/icons/fatcow/farm-fresh/16/note-edit-icon.png", tabId: tabs[0].id });
            }
        });
    }
    
    document.addEventListener('DOMContentLoaded', function () {
        var port = chrome.runtime.connect(), // https://stackoverflow.com/q/39730493
            notesStorage = new WebStore(localStorage, 'note', notesChangedCallback),
            notes = notesStorage.getAllRecords(),
            noteTextArea = document.getElementById("noteTextArea");
        
        noteTextArea.addEventListener("keyup", function () {
            var noteText = this.value;
            save(notesStorage, noteText);
        });
        
        noteTextArea.addEventListener("paste", function () {
            var noteText = this.value;
            save(notesStorage, noteText);
        });
        
        noteTextArea.addEventListener("cut", function () {
            var noteText = this.value;
            save(notesStorage, noteText);
        });
        
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var page = getNote(notesStorage, tabs[0].url);
            noteTextArea.value = page.note;
        });

    });

}());

