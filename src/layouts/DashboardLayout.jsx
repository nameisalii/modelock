import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Lock,
  LayoutDashboard,
  Layers,
  BarChart3,
  Puzzle,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function DashboardLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/dashboard/modes', icon: Layers, label: 'Modes' },
    { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/dashboard/extension', icon: Puzzle, label: 'Extension' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <nav className="nav">
        <div className="nav__inner">
          <Link to="/dashboard" className="nav__logo">
            <div className="nav__logo-icon">
              <Lock size={16} color="white" />
            </div>
            ModeLock
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                className="btn btn--ghost"
                onClick={() => setShowMenu(!showMenu)}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-accent), #9b7dff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  color: 'white'
                }}>
                  {currentUser?.displayName?.charAt(0)?.toUpperCase() || currentUser?.email?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span style={{ fontSize: 'var(--text-sm)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
                </span>
                <ChevronDown size={14} />
              </button>

              {showMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 'var(--space-2)',
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-2)',
                  minWidth: 180,
                  boxShadow: 'var(--shadow-xl)',
                  animation: 'slideDown 0.15s ease-out',
                  zIndex: 300
                }}>
                  <div style={{ padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: 'var(--space-1)' }}>
                    {currentUser?.email}
                  </div>
                  <button
                    className="btn btn--ghost btn--full"
                    onClick={handleLogout}
                    style={{ justifyContent: 'flex-start', color: 'var(--color-danger)' }}
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar__section">
          <div className="sidebar__label">Navigation</div>
          <nav className="sidebar__nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
                }
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
