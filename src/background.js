console.log("loaded force classic prisjakt ext")
re = new RegExp('\.(?:se|nu)(.*)');

const filter = {
  url:
  [
    {hostContains: "www.prisjakt.nu"},
    {hostContains: "www.prisjakt.se"},
  ]
}
const filter2 = {
  url:
  [
    {hostContains: "classic.prisjakt.nu"},
    {hostContains: "classic.prisjakt.se"},
    {hostContains: "www.prisjakt.nu"},
    {hostContains: "www.prisjakt.se"}
  ]
}
function logOnBefore(details) {
  console.log(`onBeforeNavigate to: ${details.url}`);
  swap(details.url, details.tabId)
}

function logOnCompleted(details){
  console.log("complete!");
  if (details.url.includes("classic")) {
    browser.pageAction.setTitle({tabId: details.tabId, title: "Swap to prisjakt new"});
  } else {
    browser.pageAction.setTitle({tabId: details.tabId, title: "Swap to prisjakt classic"});
  }
}


function swap(url, tabId) {
  console.log("swap")
  path = url.match(re)
  if(!path[1].startsWith("/_internal")){
    if(url.includes("classic")){
      goToNew(path[1], tabId)
    } else {
      goToClassic(path[1], tabId)
    }
  }
}

function goToClassic(path, tabId) {
  console.log("goToClassic")
  browser.tabs.update(tabId,{url: "https://www.prisjakt.nu/_internal/switch-platform/classic?path=" + path});
}

function goToNew(path, tabId) {
  console.log("goToNew")
  browser.tabs.update(tabId,{url: "https://www.prisjakt.nu/_internal/switch-platform/rfe?path=" + path});
}

function onClicked(details) {
  console.log("onClicked")
  swap(details.url, details.id)
}

browser.webNavigation.onBeforeNavigate.addListener(logOnBefore, filter);
browser.webNavigation.onCompleted.addListener(logOnCompleted, filter2)
browser.pageAction.onClicked.addListener(onClicked)
