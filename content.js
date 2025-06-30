function getKeywords(callback) {
  chrome.runtime.sendMessage({ type: "get_keywords" }, (response) => {
    callback(response.keywords);
  });
}

function isPaidContent(article) {
  return article.querySelector('div[data-testid="paid-indicator"]') !== null;
}

function matchesKeyword(article, keywords) {
  const titleElement = article.querySelector("h1, h2, h3");
  if (!titleElement) return false;

  const titleText = titleElement.textContent.toLowerCase();
  return keywords.some((keyword) => titleText.includes(keyword.toLowerCase()));
}

function shouldRemoveArticle(article, keywords) {
  return isPaidContent(article) || matchesKeyword(article, keywords);
}

function filterArticles(keywords) {
  const articles = document.querySelectorAll("article");

  articles.forEach((article) => {
    if (shouldRemoveArticle(article, keywords)) {
      console.log("Removing article:", article);
      article.remove();
    }
  });
}

function removeMatchingArticles() {
  getKeywords((keywords) => {
    filterArticles(keywords);
  });
}

// Initial run
removeMatchingArticles();

// React to DOM changes
const observer = new MutationObserver(() => removeMatchingArticles());
observer.observe(document.body, { childList: true, subtree: true });

// React to extension messages
chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "reload_filter") {
    removeMatchingArticles();
  }
});
