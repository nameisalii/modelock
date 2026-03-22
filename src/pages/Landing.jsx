import { Link } from 'react-router-dom';
import {
  Shield,
  Layers,
  Zap,
  Globe,
  Lock,
  BarChart3,
  ArrowRight,
  ChevronRight,
  Monitor,
  Puzzle
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav__inner">
          <Link to="/" className="nav__logo">
            <div className="nav__logo-icon">
              <Lock size={16} color="white" />
            </div>
            ModeLock
          </Link>
          <div className="nav__links">
            <a href="#how-it-works" className="nav__link">How it works</a>
            <a href="#features" className="nav__link">Features</a>
            <a href="#extension" className="nav__link">Extension</a>
          </div>
          <div className="nav__actions">
            <Link to="/login" className="btn btn--ghost">Sign in</Link>
            <Link to="/signup" className="btn btn--primary">Get started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero__badge">
          <span className="badge badge--accent">
            <Zap size={12} />
            User-defined focus system
          </span>
        </div>

        <h1 className="hero__title">
          Your browser should<br />follow <span>your rules</span>
        </h1>

        <p className="hero__subtitle">
          Create unlimited custom browsing modes, define exactly what belongs in each one,
          and turn your browser into a focus system built around intention.
        </p>

        <div className="hero__cta">
          <Link to="/signup" className="btn btn--primary btn--lg">
            Start building your modes
            <ArrowRight size={18} />
          </Link>
          <a href="#how-it-works" className="btn btn--secondary btn--lg">
            See how it works
          </a>
        </div>

        {/* Dashboard Mockup */}
        <div className="hero__visual">
          <div className="hero__mockup">
            <div className="hero__mockup-header">
              <span className="hero__mockup-dot"></span>
              <span className="hero__mockup-dot"></span>
              <span className="hero__mockup-dot"></span>
            </div>
            <div className="hero__mockup-body">
              <div className="hero__mockup-sidebar">
                <div className="hero__mockup-sidebar-item hero__mockup-sidebar-item--active">
                  <Layers size={14} /> Research Paper
                </div>
                <div className="hero__mockup-sidebar-item">
                  <Layers size={14} /> Exam Prep
                </div>
                <div className="hero__mockup-sidebar-item">
                  <Layers size={14} /> Startup Work
                </div>
                <div className="hero__mockup-sidebar-item">
                  <Layers size={14} /> Job Hunt
                </div>
                <div className="hero__mockup-sidebar-item">
                  <Layers size={14} /> Writing Sprint
                </div>
              </div>
              <div className="hero__mockup-content">
                <div className="hero__mockup-content-header">Research Paper</div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                  Allowed websites for this mode
                </p>
                <div className="hero__mockup-domain-list">
                  <span className="hero__mockup-domain">scholar.google.com</span>
                  <span className="hero__mockup-domain">arxiv.org</span>
                  <span className="hero__mockup-domain">jstor.org</span>
                  <span className="hero__mockup-domain">docs.google.com</span>
                  <span className="hero__mockup-domain">overleaf.com</span>
                  <span className="hero__mockup-domain">semanticscholar.org</span>
                  <span className="hero__mockup-domain">zotero.org</span>
                  <span className="hero__mockup-domain">sci-hub.se</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section section--center">
        <div className="page-container">
          <span className="section__label">How it works</span>
          <h2 className="section__title">Three steps to focused browsing</h2>
          <p className="section__subtitle">
            ModeLock gives you complete control over your browsing environment.
            No defaults. No assumptions. Just your rules.
          </p>

          <div className="steps-grid">
            <div className="step-card card">
              <div className="step-card__number">01</div>
              <h3 className="step-card__title">Create your modes</h3>
              <p className="step-card__desc">
                Define custom focus modes for any workflow. Name them, describe them,
                and add the exact websites you need — nothing more.
              </p>
            </div>
            <div className="step-card card">
              <div className="step-card__number">02</div>
              <h3 className="step-card__title">Connect the extension</h3>
              <p className="step-card__desc">
                Install the ModeLock browser extension and sign in.
                Your modes sync instantly and are ready to activate.
              </p>
            </div>
            <div className="step-card card">
              <div className="step-card__number">03</div>
              <h3 className="step-card__title">Activate and focus</h3>
              <p className="step-card__desc">
                Select a mode through the extension. Only your chosen websites
                are accessible. Everything else is elegantly blocked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section section--alt">
        <div className="page-container">
          <span className="section__label">Features</span>
          <h2 className="section__title">Built around your intention</h2>
          <p className="section__subtitle">
            Every feature exists to give you more control, not less.
            ModeLock trusts you to define what focus means.
          </p>

          <div className="features-grid">
            <div className="feature-card card card--interactive">
              <div className="feature-card__icon">
                <Layers size={22} />
              </div>
              <h3 className="feature-card__title">Unlimited custom modes</h3>
              <p className="feature-card__desc">
                Create as many browsing modes as you need. Research, writing, studying,
                designing — each gets its own allowed website list.
              </p>
            </div>
            <div className="feature-card card card--interactive">
              <div className="feature-card__icon">
                <Shield size={22} />
              </div>
              <h3 className="feature-card__title">No default restrictions</h3>
              <p className="feature-card__desc">
                The system starts completely neutral. Nothing is pre-blocked
                or pre-allowed. You define every rule from scratch.
              </p>
            </div>
            <div className="feature-card card card--interactive">
              <div className="feature-card__icon">
                <Globe size={22} />
              </div>
              <h3 className="feature-card__title">Domain-level precision</h3>
              <p className="feature-card__desc">
                Allow full domains, specific subdomains, or exact URLs.
                Your modes are as broad or as specific as you need.
              </p>
            </div>
            <div className="feature-card card card--interactive">
              <div className="feature-card__icon">
                <BarChart3 size={22} />
              </div>
              <h3 className="feature-card__title">Session analytics</h3>
              <p className="feature-card__desc">
                Track focus sessions, blocked attempts, and mode usage over time.
                Understand your browsing patterns without judgment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Extension Section */}
      <section id="extension" className="section">
        <div className="page-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)', alignItems: 'center' }}>
            <div>
              <span className="section__label">Web + Extension</span>
              <h2 className="section__title">A complete focus ecosystem</h2>
              <p className="section__subtitle">
                The website is your command center. The extension is your enforcement layer.
                Together, they create a browsing environment that follows your rules.
              </p>
              <div style={{ marginTop: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Monitor size={16} style={{ color: 'var(--color-accent-text)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>Web platform</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Create, edit, and manage all your modes</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Puzzle size={16} style={{ color: 'var(--color-accent-text)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>Browser extension</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Activate modes and enforce rules in real time</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card card--accent" style={{ padding: 'var(--space-8)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success)', boxShadow: '0 0 8px rgba(52, 211, 153, 0.4)' }}></div>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Research Paper</span>
                  <span className="badge badge--success" style={{ marginLeft: 'auto' }}>Active</span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase' }}>
                  Allowed sites
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {['scholar.google.com', 'arxiv.org', 'docs.google.com', 'overleaf.com'].map(domain => (
                    <div key={domain} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-success)' }}></div>
                      {domain}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', background: 'var(--color-danger-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(248, 113, 113, 0.1)' }}>
                  <Lock size={14} style={{ color: 'var(--color-danger)' }} />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-danger)' }}>reddit.com — blocked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2 className="cta-section__title">Build the internet environment<br />your work actually needs</h2>
        <p className="cta-section__desc">
          Start creating modes in minutes. No restrictions by default.
          No assumptions about your workflow. Just your rules, enforced.
        </p>
        <Link to="/signup" className="btn btn--primary btn--lg">
          Get started free
          <ChevronRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer__inner">
          <span className="footer__copy">© 2026 ModeLock. All rights reserved.</span>
          <div className="footer__links">
            <a href="#" className="footer__link">Privacy</a>
            <a href="#" className="footer__link">Terms</a>
            <a href="#" className="footer__link">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
