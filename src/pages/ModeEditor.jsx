import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useModes } from '../contexts/ModesContext';
import {
  ArrowLeft,
  Plus,
  X,
  Globe,
  Clock,
  Save,
  Trash2,
  Link2
} from 'lucide-react';

export default function ModeEditor() {
  const { modeId } = useParams();
  const isEditing = modeId && modeId !== 'new';
  const navigate = useNavigate();
  const { modes, createMode, updateMode, deleteMode } = useModes();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [domainInput, setDomainInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [domains, setDomains] = useState([]);
  const [urls, setUrls] = useState([]);
  const [sessionDuration, setSessionDuration] = useState('');
  const [saving, setSaving] = useState(false);

  // Load existing mode data
  useEffect(() => {
    if (isEditing) {
      const mode = modes.find((m) => m.id === modeId);
      if (mode) {
        setName(mode.name || '');
        setDescription(mode.description || '');
        setDomains(mode.allowedDomains || []);
        setUrls(mode.allowedUrls || []);
        setSessionDuration(mode.sessionDuration?.toString() || '');
      }
    }
  }, [isEditing, modeId, modes]);

  function parseDomain(input) {
    let cleaned = input.trim().toLowerCase();
    cleaned = cleaned.replace(/^(https?:\/\/)/, '');
    cleaned = cleaned.replace(/\/.*$/, '');
    return cleaned;
  }

  function addDomain(e) {
    e.preventDefault();
    const domain = parseDomain(domainInput);
    if (domain && !domains.includes(domain)) {
      setDomains([...domains, domain]);
      setDomainInput('');
    }
  }

  function removeDomain(domain) {
    setDomains(domains.filter((d) => d !== domain));
  }

  function addUrl(e) {
    e.preventDefault();
    const url = urlInput.trim();
    if (url && !urls.includes(url)) {
      setUrls([...urls, url]);
      setUrlInput('');
    }
  }

  function removeUrl(url) {
    setUrls(urls.filter((u) => u !== url));
  }

  async function handleSave() {
    if (!name.trim()) return;

    setSaving(true);
    const modeData = {
      name: name.trim(),
      description: description.trim(),
      allowedDomains: domains,
      allowedUrls: urls,
      sessionDuration: sessionDuration ? parseInt(sessionDuration) : null
    };

    try {
      if (isEditing) {
        await updateMode(modeId, modeData);
      } else {
        await createMode(modeData);
      }
      navigate('/dashboard/modes');
    } catch (err) {
      console.error('Failed to save mode:', err);
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (confirm('Are you sure you want to delete this mode? This cannot be undone.')) {
      await deleteMode(modeId);
      navigate('/dashboard/modes');
    }
  }

  return (
    <div className="mode-editor">
      <button
        className="btn btn--ghost"
        onClick={() => navigate('/dashboard/modes')}
        style={{ marginBottom: 'var(--space-6)' }}
      >
        <ArrowLeft size={16} />
        Back to modes
      </button>

      <div className="main-content__header">
        <h1 className="main-content__title">
          {isEditing ? 'Edit Mode' : 'Create New Mode'}
        </h1>
        <p className="main-content__subtitle">
          {isEditing
            ? 'Update your mode settings and allowed websites'
            : 'Define a custom browsing environment for your workflow'}
        </p>
      </div>

      {/* Mode Name & Description */}
      <div className="mode-editor__section">
        <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
          <label className="form-label--regular form-label">Mode Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g., Research Paper, Exam Prep, Design Sprint"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label--regular form-label">
            Description
            <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, marginLeft: 'var(--space-2)' }}>optional</span>
          </label>
          <textarea
            className="form-input form-textarea"
            placeholder="What is this mode for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Allowed Domains */}
      <div className="mode-editor__section">
        <h3 className="mode-editor__section-title">
          <Globe size={18} style={{ color: 'var(--color-accent-text)' }} />
          Allowed Domains
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
          Add domains that should be accessible when this mode is active.
          Any site not listed will be blocked.
        </p>

        <form onSubmit={addDomain} className="domain-input-wrapper">
          <input
            type="text"
            className="form-input"
            placeholder="Enter domain (e.g., docs.google.com)"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
          />
          <button type="submit" className="btn btn--secondary" disabled={!domainInput.trim()}>
            <Plus size={16} />
            Add
          </button>
        </form>

        <div className="domains-list">
          {domains.map((domain) => (
            <span key={domain} className="domain-tag">
              {domain}
              <button className="domain-tag__remove" onClick={() => removeDomain(domain)}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>

        {domains.length === 0 && (
          <p className="form-hint" style={{ marginTop: 'var(--space-3)' }}>
            No domains added yet. Add domains to define what's accessible in this mode.
          </p>
        )}
      </div>

      {/* Allowed URLs */}
      <div className="mode-editor__section">
        <h3 className="mode-editor__section-title">
          <Link2 size={18} style={{ color: 'var(--color-accent-text)' }} />
          Specific URLs
          <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: 'var(--text-sm)', marginLeft: 'var(--space-2)' }}>optional</span>
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
          Add specific URLs if you want finer control beyond full domains.
        </p>

        <form onSubmit={addUrl} className="domain-input-wrapper">
          <input
            type="text"
            className="form-input"
            placeholder="Enter full URL (e.g., https://arxiv.org/abs/2301.00001)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button type="submit" className="btn btn--secondary" disabled={!urlInput.trim()}>
            <Plus size={16} />
            Add
          </button>
        </form>

        <div className="domains-list">
          {urls.map((url) => (
            <span key={url} className="domain-tag">
              {url.length > 50 ? url.substring(0, 50) + '...' : url}
              <button className="domain-tag__remove" onClick={() => removeUrl(url)}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Session Duration */}
      <div className="mode-editor__section">
        <h3 className="mode-editor__section-title">
          <Clock size={18} style={{ color: 'var(--color-accent-text)' }} />
          Session Duration
          <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: 'var(--text-sm)', marginLeft: 'var(--space-2)' }}>optional</span>
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
          Set a default session length in minutes. Leave empty for unlimited sessions.
        </p>
        <input
          type="number"
          className="form-input"
          placeholder="e.g., 60"
          value={sessionDuration}
          onChange={(e) => setSessionDuration(e.target.value)}
          min="1"
          max="1440"
          style={{ maxWidth: 200 }}
        />
      </div>

      {/* Actions */}
      <div className="mode-editor__actions">
        <button
          className="btn btn--primary btn--lg"
          onClick={handleSave}
          disabled={saving || !name.trim()}
        >
          <Save size={16} />
          {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Create mode'}
        </button>
        <button
          className="btn btn--secondary btn--lg"
          onClick={() => navigate('/dashboard/modes')}
        >
          Cancel
        </button>
        {isEditing && (
          <button
            className="btn btn--danger btn--lg"
            onClick={handleDelete}
            style={{ marginLeft: 'auto' }}
          >
            <Trash2 size={16} />
            Delete mode
          </button>
        )}
      </div>
    </div>
  );
}
