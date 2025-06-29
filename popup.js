document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("keywords");
  const saveBtn = document.getElementById("save");

  chrome.storage.local.get(["filter_keywords"], (result) => {
    const keywords = result.filter_keywords || [];
    textarea.value = keywords.join("\n");
  });

  saveBtn.addEventListener("click", () => {
    const lines = textarea.value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    chrome.storage.local.set({ filter_keywords: lines }, () => {
      // Notify content scripts to reload filtering
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: "reload_filter" });
        }
      });
      window.close();
    });
  });
});
