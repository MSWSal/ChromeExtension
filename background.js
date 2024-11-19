// Create the context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "searchSelectedText",
    title: "Search '%s'", // '%s' will be replaced with the selected text
    contexts: ["selection"], // Only show this menu for selected text
  });
});

// Handle the click on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "searchSelectedText" && info.selectionText) {
    const query = encodeURIComponent(info.selectionText);
    const searchUrl = `https://www.google.com/search?q=${query}`;
    chrome.tabs.create({ url: searchUrl });
  }
});
