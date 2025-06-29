function getKeywords(callback) {
  chrome.runtime.sendMessage({ type: "get_keywords" }, (response) => {
    callback(response.keywords);
  });
}

function removeMatchingArticles() {
  getKeywords((keywords) => {
    const articles = document.querySelectorAll("article");

    articles.forEach((article) => {
      const titleElement = article.querySelector("h2, h3, h1");
      if (!titleElement) return;

      const titleText = titleElement.textContent.toLowerCase();

      const matches = keywords.some((keyword) =>
        titleText.includes(keyword.toLowerCase()),
      );

      if (matches) {
        article.remove();
      }
    });
  });
}

removeMatchingArticles();

const observer = new MutationObserver(() => removeMatchingArticles());
observer.observe(document.body, { childList: true, subtree: true });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "reload_filter") {
    removeMatchingArticles();
  }
});
