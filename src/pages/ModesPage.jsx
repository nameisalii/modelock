import { Link } from 'react-router-dom';
import { useModes } from '../contexts/ModesContext';
import {
  Plus,
  Layers,
  MoreHorizontal,
  Edit2,
  Copy,
  Trash2,
  Clock
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function ModesPage() {
  const { modes, deleteMode, duplicateMode } = useModes();
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleDelete(modeId) {
    if (confirm('Are you sure you want to delete this mode?')) {
      deleteMode(modeId);
    }
    setOpenMenu(null);
  }

  function handleDuplicate(mode) {
    duplicateMode(mode);
    setOpenMenu(null);
  }

  function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <div>
      <div className="main-content__header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="main-content__title">Modes</h1>
          <p className="main-content__subtitle">
            Create and manage your custom browsing modes
          </p>
        </div>
        <Link to="/dashboard/modes/new" className="btn btn--primary">
          <Plus size={16} />
          New mode
        </Link>
      </div>

      <div className="modes-grid">
        {/* Create Mode Card */}
        <Link to="/dashboard/modes/new" className="create-mode-card">
          <div className="create-mode-card__icon">
            <Plus size={24} />
          </div>
          <span className="create-mode-card__text">Create a new mode</span>
        </Link>

        {modes.map((mode) => (
          <div key={mode.id} className="card card--interactive mode-card">
            <div className="mode-card__header">
              <Link to={`/dashboard/modes/${mode.id}`}>
                <h3 className="mode-card__name">{mode.name}</h3>
              </Link>
              <div ref={openMenu === mode.id ? menuRef : undefined} style={{ position: 'relative' }}>
                <button
                  className="btn btn--ghost btn--icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(openMenu === mode.id ? null : mode.id);
                  }}
                >
                  <MoreHorizontal size={16} />
                </button>
                {openMenu === mode.id && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 'var(--space-1)',
                    background: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-1)',
                    minWidth: 160,
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 50,
                    animation: 'slideDown 0.15s ease-out'
                  }}>
                    <Link
                      to={`/dashboard/modes/${mode.id}`}
                      className="btn btn--ghost btn--full"
                      style={{ justifyContent: 'flex-start', padding: 'var(--space-2) var(--space-3)' }}
                    >
                      <Edit2 size={14} /> Edit
                    </Link>
                    <button
                      className="btn btn--ghost btn--full"
                      onClick={() => handleDuplicate(mode)}
                      style={{ justifyContent: 'flex-start', padding: 'var(--space-2) var(--space-3)' }}
                    >
                      <Copy size={14} /> Duplicate
                    </button>
                    <button
                      className="btn btn--ghost btn--full"
                      onClick={() => handleDelete(mode.id)}
                      style={{ justifyContent: 'flex-start', padding: 'var(--space-2) var(--space-3)', color: 'var(--color-danger)' }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {mode.description && (
              <p className="mode-card__description">{mode.description}</p>
            )}

            <div className="mode-card__domains">
              {(mode.allowedDomains || []).slice(0, 4).map((domain, i) => (
                <span key={i} className="mode-card__domain">{domain}</span>
              ))}
              {(mode.allowedDomains || []).length > 4 && (
                <span className="mode-card__domain">+{mode.allowedDomains.length - 4} more</span>
              )}
            </div>

            <div className="mode-card__footer">
              <span className="mode-card__meta">
                {(mode.allowedDomains?.length || 0) + (mode.allowedUrls?.length || 0)} sites
              </span>
              {mode.sessionDuration && (
                <span className="badge badge--neutral">
                  <Clock size={10} />
                  {mode.sessionDuration}m
                </span>
              )}
              <span className="mode-card__meta">{formatDate(mode.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>

      {modes.length === 0 && (
        <div className="empty-state" style={{ marginTop: 'var(--space-8)' }}>
          <div className="empty-state__icon">
            <Layers size={28} />
          </div>
          <h3 className="empty-state__title">Start with your first mode</h3>
          <p className="empty-state__desc">
            Modes are custom browsing environments. Create one to define which
            websites belong in your workflow.
          </p>
        </div>
      )}
    </div>
  );
}
