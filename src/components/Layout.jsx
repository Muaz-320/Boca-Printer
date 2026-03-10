import { useState } from 'react';
import './Layout.css';

const logoUrl = 'https://wildrivers.kiwiticketing.com/wp-content/themes/kiwiticketing/assets/images/wildrivers-logo.png';

function PrintIcon({ className }) {
  return (
    <span className={className} aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
    </span>
  );
}

export default function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <aside className={`sidebar ${sidebarCollapsed ? 'sidebar--collapsed' : ''}`}>
        <div className="sidebar-header">
          <a href="/" className="sidebar-logo" aria-label="Wild Rivers Home">
            <img src={logoUrl} alt="Wild Rivers" className="sidebar-logo-img" />
          </a>
          <button
            type="button"
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed((c) => !c)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="sidebar-toggle-icon">{sidebarCollapsed ? '›' : '‹'}</span>
          </button>
        </div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <a href="/" className="sidebar-nav-item sidebar-nav-item--active">
            <PrintIcon className="sidebar-nav-icon" />
            <span className="sidebar-nav-label">Print Ticket</span>
          </a>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-footer-label">Boca Ticket Print</div>
          <div className="sidebar-footer-version">v1.0</div>
        </div>
      </aside>
      <div className="app-main">
        {children}
      </div>
    </div>
  );
}
