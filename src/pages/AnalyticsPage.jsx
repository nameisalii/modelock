import { useModes } from '../contexts/ModesContext';
import {
  BarChart3,
  Layers,
  Shield,
  Clock,
  TrendingUp,
  Calendar
} from 'lucide-react';

export default function AnalyticsPage() {
  const { modes, sessions } = useModes();

  const totalSessions = sessions.length;
  const totalBlocked = sessions.reduce((sum, s) => sum + (s.blockedAttempts || 0), 0);

  // Focus time
  const totalFocusMinutes = sessions.reduce((sum, s) => {
    if (s.startedAt && s.endedAt) {
      const start = s.startedAt?.toDate ? s.startedAt.toDate() : new Date(s.startedAt);
      const end = s.endedAt?.toDate ? s.endedAt.toDate() : new Date(s.endedAt);
      return sum + (end - start) / 60000;
    }
    return sum;
  }, 0);

  const focusHours = Math.floor(totalFocusMinutes / 60);
  const focusMins = Math.round(totalFocusMinutes % 60);

  // Mode usage counts
  const modeUsage = {};
  sessions.forEach((s) => {
    modeUsage[s.modeId] = (modeUsage[s.modeId] || 0) + 1;
  });

  const modeUsageArray = Object.entries(modeUsage)
    .map(([modeId, count]) => {
      const mode = modes.find((m) => m.id === modeId);
      return { name: mode?.name || 'Unknown', count };
    })
    .sort((a, b) => b.count - a.count);

  const maxUsage = Math.max(...modeUsageArray.map((m) => m.count), 1);

  // Top blocked sites
  const blockedSiteCounts = {};
  sessions.forEach((s) => {
    (s.blockedSites || []).forEach((site) => {
      blockedSiteCounts[site] = (blockedSiteCounts[site] || 0) + 1;
    });
  });

  const topBlockedSites = Object.entries(blockedSiteCounts)
    .map(([site, count]) => ({ site, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Week activity (simulated from sessions)
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekActivity = weekDays.map((day, i) => {
    const daySessions = sessions.filter((s) => {
      if (!s.startedAt) return false;
      const date = s.startedAt?.toDate ? s.startedAt.toDate() : new Date(s.startedAt);
      return date.getDay() === (i + 1) % 7;
    });
    return { day, count: daySessions.length };
  });

  const maxWeekActivity = Math.max(...weekActivity.map((d) => d.count), 1);

  const recentSessions = sessions.slice(0, 10);

  return (
    <div>
      <div className="main-content__header">
        <h1 className="main-content__title">Analytics</h1>
        <p className="main-content__subtitle">
          Track your focus sessions and browsing patterns
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-card__label">Total Sessions</div>
          <div className="stat-card__value">{totalSessions}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-card__label">Sites Blocked</div>
          <div className="stat-card__value">{totalBlocked}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-card__label">Total Focus Time</div>
          <div className="stat-card__value">
            {focusHours > 0 ? `${focusHours}h ${focusMins}m` : `${focusMins}m`}
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-card__label">Active Modes</div>
          <div className="stat-card__value">{modes.length}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="analytics-grid" style={{ marginTop: 'var(--space-4)' }}>
        {/* Weekly Activity */}
        <div className="card chart-card">
          <div className="chart-card__header">
            <h3 className="chart-card__title">
              <Calendar size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle', color: 'var(--color-accent-text)' }} />
              Weekly Activity
            </h3>
          </div>
          {totalSessions > 0 ? (
            <div className="bar-chart">
              {weekActivity.map((day) => (
                <div key={day.day} className="bar-chart__bar">
                  <div
                    className="bar-chart__fill"
                    style={{ height: `${(day.count / maxWeekActivity) * 100}%` }}
                  />
                  <span className="bar-chart__label">{day.day}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
              No session data yet
            </div>
          )}
        </div>

        {/* Mode Usage */}
        <div className="card chart-card">
          <div className="chart-card__header">
            <h3 className="chart-card__title">
              <TrendingUp size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle', color: 'var(--color-accent-text)' }} />
              Mode Usage
            </h3>
          </div>
          {modeUsageArray.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {modeUsageArray.slice(0, 6).map((item) => (
                <div key={item.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{item.name}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{item.count} sessions</span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{
                      width: `${(item.count / maxUsage) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--color-accent), #9b7dff)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width var(--transition-slow)'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
              No usage data yet
            </div>
          )}
        </div>

        {/* Top Blocked Sites */}
        <div className="card chart-card">
          <div className="chart-card__header">
            <h3 className="chart-card__title">
              <Shield size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle', color: 'var(--color-accent-text)' }} />
              Top Blocked Sites
            </h3>
          </div>
          {topBlockedSites.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {topBlockedSites.map((item) => (
                <div key={item.site} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-2) var(--space-3)',
                  background: 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{item.site}</span>
                  <span className="badge badge--neutral">{item.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
              No blocked sites yet
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        <div className="card chart-card">
          <div className="chart-card__header">
            <h3 className="chart-card__title">
              <Clock size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle', color: 'var(--color-accent-text)' }} />
              Recent Sessions
            </h3>
          </div>
          {recentSessions.length > 0 ? (
            <div className="session-list">
              {recentSessions.map((session) => {
                const mode = modes.find((m) => m.id === session.modeId);
                const startDate = session.startedAt?.toDate ? session.startedAt.toDate() : new Date(session.startedAt);
                return (
                  <div key={session.id} className="session-item">
                    <div className="session-item__info">
                      <div className="session-item__mode">{mode?.name || 'Unknown'}</div>
                      <div className="session-item__time">
                        {startDate.toLocaleDateString()} · {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="session-item__stats">
                      <div className="session-item__stat">
                        <div className="session-item__stat-value">{session.blockedAttempts || 0}</div>
                        <div className="session-item__stat-label">blocked</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
              No sessions recorded yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
