import { Link } from 'react-router-dom';
import {
  Puzzle,
  Download,
  LogIn,
  RefreshCw,
  Zap,
  Chrome,
  ArrowRight,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ExtensionPage() {
  const [connected, setConnected] = useState(false); // Extension connection state

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.source !== window) return;
      if (event.data && event.data.type === 'MODELOCK_EXTENSION_INSTALLED') {
        setConnected(true);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Ping the extension because it might have already injected before this component mounted
    // Needs a slight delay to ensure event listener is ready if it's the first load
    setTimeout(() => {
        window.postMessage({ type: 'MODELOCK_PING' }, '*');
    }, 100);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div>
      <div className="main-content__header">
        <h1 className="main-content__title">Browser Extension</h1>
        <p className="main-content__subtitle">
          Connect the ModeLock extension to enforce your modes in real time
        </p>
      </div>

      {/* Connection Status */}
      <div className={`connection-status ${connected ? 'connection-status--connected' : 'connection-status--disconnected'}`} style={{ marginBottom: 'var(--space-8)' }}>
        <div className="connection-status__dot" />
        <div className="connection-status__text">
          {connected ? 'Extension connected and synced' : 'Extension not connected'}
        </div>
      </div>

      {/* How it works */}
      <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="card__header">
          <div>
            <h3 className="card__title">How the extension works</h3>
            <p className="card__subtitle" style={{ marginTop: 'var(--space-1)' }}>
              The extension brings your modes to life by enforcing them in your browser
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
          <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, margin: '0 auto var(--space-3)', borderRadius: 'var(--radius-lg)', background: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Puzzle size={18} style={{ color: 'var(--color-accent-text)' }} />
            </div>
            <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Syncs modes</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
              Pulls your saved modes from your account
            </div>
          </div>
          <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, margin: '0 auto var(--space-3)', borderRadius: 'var(--radius-lg)', background: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} style={{ color: 'var(--color-accent-text)' }} />
            </div>
            <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Activates sessions</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
              One-click mode activation from the popup
            </div>
          </div>
          <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, margin: '0 auto var(--space-3)', borderRadius: 'var(--radius-lg)', background: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={18} style={{ color: 'var(--color-accent-text)' }} />
            </div>
            <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>Enforces rules</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
              Blocks non-matching sites in real time
            </div>
          </div>
        </div>
      </div>

      {/* Setup Steps */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Get started</h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
          Follow these steps to connect the extension to your account
        </p>

        <div className="extension-steps">
          <div className="card extension-step">
            <div className="extension-step__number">1</div>
            <div className="extension-step__content">
              <h4 className="extension-step__title">Install the extension</h4>
              <p className="extension-step__desc">
                Download and install the ModeLock extension from the Chrome Web Store.
                It works with Chrome, Brave, Edge, and other Chromium-based browsers.
              </p>
              <button 
                className="btn btn--primary" 
                style={{ marginTop: 'var(--space-4)' }}
                onClick={() => alert(`Developer Preview:\\n\\nThe extension is not yet published to the Chrome Web Store.\\n\\nTo install it locally for testing:\\n1. Open Google Chrome and go to chrome://extensions/\\n2. Toggle on "Developer mode" (top right)\\n3. Click "Load unpacked" (top left)\\n4. Select the 'hackduke/extension' folder`)}
              >
                <Chrome size={16} />
                Add to Chrome
                <ExternalLink size={12} />
              </button>
            </div>
          </div>

          <div className="card extension-step">
            <div className="extension-step__number">2</div>
            <div className="extension-step__content">
              <h4 className="extension-step__title">Sign in to the extension</h4>
              <p className="extension-step__desc">
                Open the extension popup and sign in with the same account you use on this website.
                This links your modes to the extension.
              </p>
            </div>
          </div>

          <div className="card extension-step">
            <div className="extension-step__number">3</div>
            <div className="extension-step__content">
              <h4 className="extension-step__title">Sync your modes</h4>
              <p className="extension-step__desc">
                Once signed in, the extension will automatically sync all your saved modes.
                Any changes you make on the website will reflect in the extension.
              </p>
            </div>
          </div>

          <div className="card extension-step">
            <div className="extension-step__number">4</div>
            <div className="extension-step__content">
              <h4 className="extension-step__title">Activate a mode</h4>
              <p className="extension-step__desc">
                Select any mode from the extension popup and activate it.
                The extension will immediately begin monitoring your tabs and enforcing your rules.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Extension Features */}
      <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="card__header">
          <h3 className="card__title">Extension features</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {[
            { icon: Zap, text: 'One-click mode activation from browser toolbar' },
            { icon: RefreshCw, text: 'Real-time sync with your web dashboard' },
            { icon: CheckCircle, text: 'Elegant blocked page when visiting non-allowed sites' },
            { icon: Chrome, text: 'Works with all Chromium-based browsers' }
          ].map((feature, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--color-bg-subtle)',
              borderRadius: 'var(--radius-md)'
            }}>
              <feature.icon size={16} style={{ color: 'var(--color-accent-text)', flexShrink: 0 }} />
              <span style={{ fontSize: 'var(--text-sm)' }}>{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* DEBUG ACTION */}
      <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid #333' }}>
        <h4 style={{ marginBottom: 'var(--space-2)' }}>Debug: Force Sync Data</h4>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
          If modes aren't appearing in your extension, click this to manually broadcast them to the content script.
        </p>
        <button 
          className="btn btn--secondary" 
          onClick={() => {
            const userId = localStorage.getItem('modeLock_user') ? JSON.parse(localStorage.getItem('modeLock_user')).uid : null;
            if (!userId) {
              alert('Debug Error: You are not logged in!');
              return;
            }
            const modesData = localStorage.getItem(`modeLock_modes_${userId}`);
            if (!modesData || modesData === '[]') {
              alert('Debug Error: No modes available in LocalStorage! Go to the "Modes" tab and create one first.');
              return;
            }
            try {
              const modes = JSON.parse(modesData);
              window.postMessage({ type: 'MODELOCK_SYNC_MODES', modes: modes }, '*');
              alert(`Success! Broadcasted ${modes.length} mode(s) to the extension.`);
            } catch (e) {
              alert('Error parsing modes: ' + e.message);
            }
          }}
        >
          <RefreshCw size={14} style={{ marginRight: '6px' }} />
          Force manual sync
        </button>
      </div>

    </div>
  );
}
