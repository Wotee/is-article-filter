chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "get_keywords") {
    chrome.storage.local.get(["filter_keywords"], (result) => {
      sendResponse({ keywords: result.filter_keywords || [] });
    });
    return true; // Keep message channel open
  }
});
