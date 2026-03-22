import { Link } from 'react-router-dom';
import { useModes } from '../contexts/ModesContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Layers,
  Plus,
  Clock,
  Shield,
  BarChart3,
  ArrowRight,
  Zap
} from 'lucide-react';

export default function DashboardOverview() {
  const { modes, sessions } = useModes();
  const { currentUser } = useAuth();

  const totalSessions = sessions.length;
  const totalBlocked = sessions.reduce((sum, s) => sum + (s.blockedAttempts || 0), 0);
  const recentModes = modes.slice(0, 3);
  const recentSessions = sessions.slice(0, 5);

  // Calculate total focus time from sessions
  const totalFocusMinutes = sessions.reduce((sum, s) => {
    if (s.startedAt && s.endedAt) {
      const start = s.startedAt.toDate ? s.startedAt.toDate() : new Date(s.startedAt);
      const end = s.endedAt.toDate ? s.endedAt.toDate() : new Date(s.endedAt);
      return sum + (end - start) / 60000;
    }
    return sum;
  }, 0);

  const focusHours = Math.floor(totalFocusMinutes / 60);
  const focusMins = Math.round(totalFocusMinutes % 60);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div>
      <div className="main-content__header">
        <h1 className="main-content__title">
          {greeting()}, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'there'}
        </h1>
        <p className="main-content__subtitle">
          Here's an overview of your focus activity
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-card__label">Total Modes</div>
          <div className="stat-card__value">{modes.length}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-card__label">Focus Sessions</div>
          <div className="stat-card__value">{totalSessions}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-card__label">Sites Blocked</div>
          <div className="stat-card__value">{totalBlocked}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-card__label">Focus Time</div>
          <div className="stat-card__value">
            {focusHours > 0 ? `${focusHours}h ${focusMins}m` : `${focusMins}m`}
          </div>
        </div>
      </div>

      {/* Quick Actions + Recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-4)' }}>
        {/* Recent Modes */}
        <div className="card">
          <div className="card__header">
            <div>
              <h3 className="card__title">Your Modes</h3>
              <p className="card__subtitle" style={{ marginTop: 'var(--space-1)' }}>
                {modes.length === 0 ? 'Create your first mode to get started' : `${modes.length} mode${modes.length !== 1 ? 's' : ''} created`}
              </p>
            </div>
            <Link to="/dashboard/modes" className="btn btn--ghost btn--sm">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {modes.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <div className="empty-state__icon">
                <Layers size={24} />
              </div>
              <p className="empty-state__title">No modes yet</p>
              <p className="empty-state__desc">
                Create your first custom browsing mode to start focusing.
              </p>
              <Link to="/dashboard/modes/new" className="btn btn--primary">
                <Plus size={16} />
                Create mode
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {recentModes.map((mode) => (
                <Link
                  key={mode.id}
                  to={`/dashboard/modes/${mode.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--color-bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-subtle)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <Layers size={16} style={{ color: 'var(--color-accent-text)' }} />
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{mode.name}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                        {(mode.allowedDomains?.length || 0) + (mode.allowedUrls?.length || 0)} site{(mode.allowedDomains?.length || 0) + (mode.allowedUrls?.length || 0) !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={14} style={{ color: 'var(--color-text-tertiary)' }} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card__header">
            <div>
              <h3 className="card__title">Quick Actions</h3>
              <p className="card__subtitle" style={{ marginTop: 'var(--space-1)' }}>
                Common tasks
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Link
              to="/dashboard/modes/new"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--color-accent-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(124, 92, 252, 0.12)',
                transition: 'all var(--transition-fast)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500
              }}
            >
              <Plus size={16} style={{ color: 'var(--color-accent-text)' }} />
              Create new mode
            </Link>
            <Link
              to="/dashboard/analytics"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--color-bg-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-subtle)',
                transition: 'all var(--transition-fast)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500
              }}
            >
              <BarChart3 size={16} style={{ color: 'var(--color-text-tertiary)' }} />
              View analytics
            </Link>
            <Link
              to="/dashboard/extension"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--color-bg-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-subtle)',
                transition: 'all var(--transition-fast)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500
              }}
            >
              <Zap size={16} style={{ color: 'var(--color-text-tertiary)' }} />
              Connect extension
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div className="card" style={{ marginTop: 'var(--space-6)' }}>
          <div className="card__header">
            <div>
              <h3 className="card__title">Recent Sessions</h3>
              <p className="card__subtitle" style={{ marginTop: 'var(--space-1)' }}>
                Your latest focus sessions
              </p>
            </div>
            <Link to="/dashboard/analytics" className="btn btn--ghost btn--sm">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="session-list">
            {recentSessions.map((session) => {
              const mode = modes.find((m) => m.id === session.modeId);
              const startDate = session.startedAt?.toDate ? session.startedAt.toDate() : new Date(session.startedAt);
              return (
                <div key={session.id} className="session-item">
                  <div className="session-item__info">
                    <div className="session-item__mode">
                      <Layers size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                      {mode?.name || 'Unknown Mode'}
                    </div>
                    <div className="session-item__time">
                      {startDate.toLocaleDateString()} at {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="session-item__stats">
                    <div className="session-item__stat">
                      <div className="session-item__stat-value">{session.blockedAttempts || 0}</div>
                      <div className="session-item__stat-label">blocked</div>
                    </div>
                    <span className={`badge ${session.activeStatus ? 'badge--success' : 'badge--neutral'}`}>
                      {session.activeStatus ? 'Active' : 'Ended'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
