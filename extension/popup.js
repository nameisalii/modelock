// ModeLock Extension Popup Logic

const content = document.getElementById('content');
const dashboardLink = document.getElementById('dashboardLink');

// Dashboard URL — update to your deployed URL
const DASHBOARD_URL = 'http://localhost:5173/dashboard';
dashboardLink.href = DASHBOARD_URL;
dashboardLink.addEventListener('click', (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: DASHBOARD_URL });
});

let modes = [];
let activeMode = null;
let sessionStartTime = null;
let timerInterval = null;

// Initialize
async function init() {
  // Get stored data
  const stored = await chrome.storage.local.get([
    'modes',
    'activeMode',
    'sessionStartTime',
    'blockedAttempts',
    'userLoggedIn'
  ]);

  modes = stored.modes || [];
  activeMode = stored.activeMode || null;
  sessionStartTime = stored.sessionStartTime || null;

  const blockedAttempts = stored.blockedAttempts || [];

  render(modes, activeMode, blockedAttempts);
}

function render(modes, activeMode, blockedAttempts) {
  if (modes.length === 0) {
    content.innerHTML = `
      <div class="empty-state">
        <p>No modes synced yet</p>
        <p style="font-size: 12px; margin-bottom: 16px;">
          Create modes on the web dashboard,<br>then they'll appear here.
        </p>
        <a href="#" id="goToDashboard">Open Dashboard</a>
      </div>
    `;
    const link = document.getElementById('goToDashboard');
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: DASHBOARD_URL });
      });
    }
    return;
  }

  let statusHtml = '';
  if (activeMode) {
    statusHtml = `
      <div class="status-bar">
        <div class="status-dot active"></div>
        <div class="status-text">${activeMode.name}</div>
        <span class="status-badge active">Active</span>
      </div>
    `;
  } else {
    statusHtml = `
      <div class="status-bar">
        <div class="status-dot inactive"></div>
        <div class="status-text" style="color: #5c5c68;">No mode active</div>
        <span class="status-badge inactive">Idle</span>
      </div>
    `;
  }

  const modesHtml = modes.map((mode) => {
    const isActive = activeMode && activeMode.id === mode.id;
    const siteCount = (mode.allowedDomains?.length || 0) + (mode.allowedUrls?.length || 0);
    return `
      <div class="mode-item ${isActive ? 'active' : ''}" data-mode-id="${mode.id}">
        <div class="mode-item-info">
          <div class="mode-item-name">${mode.name}</div>
          <div class="mode-item-sites">${siteCount} site${siteCount !== 1 ? 's' : ''} allowed</div>
        </div>
        <button class="activate-btn ${isActive ? 'deactivate' : 'activate'}" data-mode-id="${mode.id}">
          ${isActive ? 'Stop' : 'Start'}
        </button>
      </div>
    `;
  }).join('');

  let sessionHtml = '';
  if (activeMode && sessionStartTime) {
    const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    sessionHtml = `
      <div class="session-info">
        <div class="session-timer" id="timer">${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}</div>
        <div class="session-blocked">${blockedAttempts.length} blocked</div>
      </div>
    `;
  }

  content.innerHTML = `
    ${statusHtml}
    <div class="popup-body">
      <div class="section-label">Your Modes</div>
      <div class="modes-list">
        ${modesHtml}
      </div>
    </div>
    ${sessionHtml}
  `;

  // Add event listeners to buttons
  document.querySelectorAll('.activate-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const modeId = btn.dataset.modeId;
      const mode = modes.find((m) => m.id === modeId);

      if (activeMode && activeMode.id === modeId) {
        // Deactivate
        deactivateMode();
      } else {
        // Activate
        activateMode(mode);
      }
    });
  });

  // Start timer if active
  if (activeMode && sessionStartTime) {
    startTimer();
  }
}

function activateMode(mode) {
  chrome.runtime.sendMessage({
    type: 'ACTIVATE_MODE',
    mode: mode
  }, (response) => {
    if (response && response.success) {
      activeMode = mode;
      sessionStartTime = Date.now();
      chrome.storage.local.set({ sessionStartTime: sessionStartTime });
      init();
    }
  });
}

function deactivateMode() {
  chrome.runtime.sendMessage({
    type: 'DEACTIVATE_MODE'
  }, (response) => {
    if (response && response.success) {
      activeMode = null;
      sessionStartTime = null;
      if (timerInterval) clearInterval(timerInterval);
      init();
    }
  });
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (!sessionStartTime) return;
    const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timerEl = document.getElementById('timer');
    if (timerEl) {
      timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
  }, 1000);
}

// Initialize when popup opens
init();
