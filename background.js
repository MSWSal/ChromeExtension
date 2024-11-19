chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.text) {
      const query = encodeURIComponent(message.text);
      const searchUrl = `https://www.google.com/search?q=${query}`;
      chrome.tabs.create({ url: searchUrl });
    }
  });
  