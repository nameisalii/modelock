import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import {
  User,
  Shield,
  Puzzle,
  Bell,
  Trash2,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [sessionTracking, setSessionTracking] = useState(true);

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  }

  return (
    <div style={{ maxWidth: 'var(--max-width-content)' }}>
      <div className="main-content__header">
        <h1 className="main-content__title">Settings</h1>
        <p className="main-content__subtitle">
          Manage your account and preferences
        </p>
      </div>

      {/* Account */}
      <div className="settings-section">
        <h2 className="settings-section__title">
          <User size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
          Account
        </h2>
        <p className="settings-section__desc">Your account information</p>

        <div className="settings-row">
          <div className="settings-row__info">
            <div className="settings-row__label">Display name</div>
            <div className="settings-row__desc">
              {currentUser?.displayName || 'Not set'}
            </div>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row__info">
            <div className="settings-row__label">Email</div>
            <div className="settings-row__desc">{currentUser?.email}</div>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row__info">
            <div className="settings-row__label">Account created</div>
            <div className="settings-row__desc">
              {currentUser?.metadata?.creationTime
                ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                : 'Unknown'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="settings-section">
        <h2 className="settings-section__title">
          <Shield size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
          Privacy
        </h2>
        <p className="settings-section__desc">Control how your data is used</p>

        <div className="settings-row">
          <div className="settings-row__info">
            <div className="settings-row__label">Session tracking</div>
            <div className="settings-row__desc">
              Record session history and blocked attempts
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={sessionTracking}
              onChange={(e) => setSessionTracking(e.target.checked)}
            />
            <span className="toggle__slider" />
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-row__info">
            <div className="settings-row__label">Usage analytics</div>
            <div className="settings-row__desc">
              Collect anonymous usage data to improve ModeLock
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
            <span className="toggle__slider" />
          </label>
        </div>

        <div className="settings-row">
          <div className="settings-row__info">
            <div className="settings-row__label">Notifications</div>
            <div className="settings-row__desc">
              Receive session reminders and focus reports
            </div>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <span className="toggle__slider" />
          </label>
        </div>
      </div>

      {/* Extension */}
      <div className="settings-section">
        <h2 className="settings-section__title">
          <Puzzle size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
          Extension
        </h2>
        <p className="settings-section__desc">Browser extension connection status</p>

        <div className="settings-row">
          <div className="settings-row__info">
            <div className="settings-row__label">Connection status</div>
            <div className="settings-row__desc">
              Not connected
            </div>
          </div>
          <span className="badge badge--neutral">Disconnected</span>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="settings-section" style={{ borderBottom: 'none' }}>
        <h2 className="settings-section__title" style={{ color: 'var(--color-danger)' }}>
          Danger Zone
        </h2>
        <p className="settings-section__desc">Irreversible actions</p>

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          <button className="btn btn--secondary" onClick={handleLogout}>
            <LogOut size={16} />
            Sign out
          </button>
          <button className="btn btn--danger">
            <Trash2 size={16} />
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}
