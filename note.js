(function () {
    'use strict';
    
    function setNote(notesStorage, tabUrl, noteText) {
        var nowDate = (new Date()).getTime(),
            page,
            pageIdx = notesStorage.find("url", tabUrl);
        
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
            pageIdx = notesStorage.find("url", tabUrl);
        
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
    
    document.addEventListener('DOMContentLoaded', function () {
        var notesStorage = new WebStore(localStorage, 'note', notesChangedCallback),
            notes = notesStorage.getAllRecords(),
            noteTextArea = document.getElementById("noteTextArea");
        
        noteTextArea.addEventListener("keyup", function () {
            var noteText = this.value;
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                if (setNote(notesStorage, tabs[0].url, noteText)) {
                    chrome.pageAction.setIcon({ path: "icons.iconarchive.com/icons/fatcow/farm-fresh/16/note-edit-icon.png", tabId: tabs[0].id });
                }
            });      
        });
        
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var page = getNote(notesStorage, tabs[0].url);
            noteTextArea.value = page.note;
        });

    });

}());

