// ModeLock Content Script
// Injected into the web dashboard to sync modes and auth state with the extension

// Listen for messages from the web app
window.addEventListener('message', (event) => {
  // We only accept messages from ourselves
  if (event.source !== window) return;

  if (event.data.type && (event.data.type === 'MODELOCK_SYNC_MODES')) {
    chrome.storage.local.set({ modes: event.data.modes });
  }
  
  if (event.data.type && (event.data.type === 'MODELOCK_SYNC_AUTH')) {
    chrome.storage.local.set({ userLoggedIn: !!event.data.user });
  }

  // Answer PINGs from the SPA when user navigates
  if (event.data.type && (event.data.type === 'MODELOCK_PING')) {
    window.postMessage({ type: 'MODELOCK_EXTENSION_INSTALLED' }, '*');
  }
});

// Fallback: Actively poll localStorage to guarantee modes are synced
// Content scripts share localStorage with the host page
setInterval(() => {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('modeLock_modes_')) {
        const modesData = localStorage.getItem(key);
        if (modesData) {
          const finalModes = JSON.parse(modesData);
          // Try both methods of saving to ensure it works across all Chrome versions
          chrome.storage.local.set({ modes: finalModes });
          try {
             chrome.runtime.sendMessage({ type: 'SYNC_MODES', modes: finalModes }, () => {
                if (chrome.runtime.lastError) {} // ignore
             });
          } catch(e) {}
        }
      }
    }
  } catch (e) {
    // ignore
  }
}, 1000);

// Let the web app know the extension is installed initially
window.postMessage({ type: 'MODELOCK_EXTENSION_INSTALLED' }, '*');
