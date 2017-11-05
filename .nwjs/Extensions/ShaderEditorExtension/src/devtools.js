// chrome.devtools calls

chrome.devtools.panels.create( "Shader Editor",
    "icon.png",
    "panel.html",
    function(panel) {

       // code invoked on panel creation

    }
);

    var backgroundPageConnection = chrome.runtime.connect({
      name: 'panel'
    });

    backgroundPageConnection.postMessage({
      name: 'init',
      tabId: chrome.devtools.inspectedWindow.tabId
    });
    console.log(chrome.devtools.inspectedWindow);

    backgroundPageConnection.onMessage.addListener(function(msg) {
        //console.log( 'devtools.js', msg );
    });