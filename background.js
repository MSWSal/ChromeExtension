// Create the context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendToChatGPT",
    title: "Send to ChatGPT: '%s'", // '%s' will be replaced with the selected text
    contexts: ["selection"], // Only show this menu for selected text
  });
});

// Handle the click on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "sendToChatGPT" && info.selectionText) {
    const chatGPTUrl = "https://chat.openai.com/";
    const selectedText = info.selectionText;

    // Open ChatGPT in a new tab
    chrome.tabs.create({ url: chatGPTUrl }, (newTab) => {
      // After ChatGPT tab is loaded, paste the text
      chrome.scripting.executeScript({
        target: { tabId: newTab.id },
        func: (text) => {
          const inputField = document.querySelector("textarea");
          if (inputField) {
            inputField.value = text;
            inputField.focus();
          } else {
            console.error("ChatGPT prompt not found.");
          }
        },
        args: [selectedText],
      });
    });
  }
});
