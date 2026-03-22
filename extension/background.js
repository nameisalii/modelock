// ModeLock Background Service Worker
// Handles tab monitoring and URL enforcement

let activeMode = null;
let activeSessionId = null;

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    checkUrl(tabId, tab.url);
  }
});

// Listen for tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url) {
    checkUrl(activeInfo.tabId, tab.url);
  }
});

// Check URL against active mode
function checkUrl(tabId, url) {
  if (!activeMode) return;

  // Skip chrome:// and extension pages
  if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('about:')) {
    return;
  }

  const isAllowed = isUrlAllowed(url, activeMode);

  if (!isAllowed) {
    // Redirect to blocked page
    const blockedUrl = chrome.runtime.getURL(
      `blocked.html?mode=${encodeURIComponent(activeMode.name)}&url=${encodeURIComponent(url)}`
    );
    chrome.tabs.update(tabId, { url: blockedUrl });

    // Record blocked attempt
    recordBlockedAttempt(url);
  }
}

function isUrlAllowed(url, mode) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Check allowed domains
    if (mode.allowedDomains && mode.allowedDomains.length > 0) {
      for (const domain of mode.allowedDomains) {
        const cleanDomain = domain.toLowerCase().replace(/^www\./, '');
        const cleanHostname = hostname.replace(/^www\./, '');

        if (cleanHostname === cleanDomain || cleanHostname.endsWith('.' + cleanDomain)) {
          return true;
        }
      }
    }

    // Check allowed URLs
    if (mode.allowedUrls && mode.allowedUrls.length > 0) {
      for (const allowedUrl of mode.allowedUrls) {
        if (url.startsWith(allowedUrl)) {
          return true;
        }
      }
    }

    return false;
  } catch (e) {
    return true; // Allow if URL parsing fails
  }
}

function recordBlockedAttempt(url) {
  chrome.storage.local.get(['blockedAttempts'], (result) => {
    const attempts = result.blockedAttempts || [];
    try {
      const hostname = new URL(url).hostname;
      attempts.push({
        url,
        hostname,
        timestamp: Date.now()
      });
      chrome.storage.local.set({ blockedAttempts: attempts });
    } catch (e) {
      // ignore
    }
  });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'ACTIVATE_MODE':
      activeMode = message.mode;
      activeSessionId = message.sessionId || null;
      chrome.storage.local.set({
        activeMode: message.mode,
        activeSessionId: activeSessionId,
        sessionStartTime: Date.now()
      });
      // Clear previous blocked attempts
      chrome.storage.local.set({ blockedAttempts: [] });
      sendResponse({ success: true });
      break;

    case 'DEACTIVATE_MODE':
      activeMode = null;
      activeSessionId = null;
      chrome.storage.local.set({
        activeMode: null,
        activeSessionId: null,
        sessionStartTime: null
      });
      sendResponse({ success: true });
      break;

    case 'SYNC_MODES':
      chrome.storage.local.set({ modes: message.modes });
      sendResponse({ success: true });
      break;

    case 'SYNC_AUTH':
      chrome.storage.local.set({ userLoggedIn: !!message.user });
      sendResponse({ success: true });
      break;

    case 'GET_STATUS':
      sendResponse({
        activeMode,
        activeSessionId
      });
      break;

    default:
      sendResponse({ error: 'Unknown message type' });
  }
  return true;
});

// Restore state on startup
chrome.storage.local.get(['activeMode', 'activeSessionId'], (result) => {
  if (result.activeMode) {
    activeMode = result.activeMode;
    activeSessionId = result.activeSessionId;
  }
});
