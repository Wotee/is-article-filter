document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("keywords");
  const saveBtn = document.getElementById("save");
  const paidToggle = document.getElementById("paid-toggle");

  chrome.storage.local.get(
    ["filter_keywords", "hide_paid_content"],
    (result) => {
      const keywords = result.filter_keywords || [];
      const hidePaidContent = result.hide_paid_content ?? true; // Default to true

      textarea.value = keywords.join("\n");
      paidToggle.checked = hidePaidContent;
    },
  );

  saveBtn.addEventListener("click", () => {
    const lines = textarea.value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const hidePaid = paidToggle.checked;

    chrome.storage.local.set(
      { filter_keywords: lines, hide_paid_content: hidePaid },
      () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "reload_filter" });
          }
        });
        window.close();
      },
    );
  });
});
