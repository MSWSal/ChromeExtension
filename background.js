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
      // Wait for the new tab to load before injecting the script
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === newTab.id && changeInfo.status === "complete") {
          // Inject the script to paste text into the ChatGPT input field
          chrome.scripting.executeScript({
            target: { tabId: newTab.id },
            func: (text) => {
              const tryPaste = () => {
                const inputField = document.querySelector("textarea");
                if (inputField) {
                  inputField.value = text; // Paste the text
                  inputField.focus();     // Focus the input field
                  inputField.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event
                } else {
                  // Retry if the field isn't ready yet
                  setTimeout(tryPaste, 100);
                }
              };
              tryPaste();
            },
            args: [selectedText],
          });

          // Remove the listener to avoid multiple triggers
          chrome.tabs.onUpdated.removeListener(listener);
        }
      });
    });
  }
});
