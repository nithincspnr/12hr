const convertTime = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentTabId = tab.id;

  chrome.scripting.executeScript({
    target: { tabId: currentTabId },
    // uncomment below to make it execute straight away, other wise it will wait for document_idle
    // injectImmediately: true,
    func: () => {
      const treeWalker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
      );

      while (treeWalker.nextNode()) {
        const node = treeWalker.currentNode;
        // node.data = node.data.toUpperCase();
        // console.log(typeof node.data);

        if (/(\d{2}:\d{2})/.test(node.data)) {
          const numText = node.data;

          var num = /(\d{2}:\d{2})/.exec(numText);
          const timeString = num[0];
          const timeString12hr = new Date(
            "1970-01-01T" + timeString + "Z"
          ).toLocaleTimeString("en-US", {
            timeZone: "UTC",
            hour12: true,
            hour: "numeric",
            minute: "numeric",
          });

          node.data = timeString12hr;
        }
      }
    },
  });
};

document.getElementById("my-button").addEventListener("click", convertTime);
