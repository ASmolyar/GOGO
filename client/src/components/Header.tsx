import React, { useState, useEffect, useCallback } from 'react';
import gogoWideLogo from '../../assets/GOGO_LOGO_WIDE_WH.png';

function Header(): JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navigateTo = useCallback((id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      try {
        window.history.replaceState(null, '', `#${id}`);
      } catch {}
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const navItems: Array<{ label: string; id: string; icon?: JSX.Element }> = [
    { label: 'Home', id: 'hero' },
    { label: 'Our Mission', id: 'mission' },
    { label: 'Music', id: 'music' },
    { label: 'Impact', id: 'impact' },
    { label: 'Curriculum', id: 'curriculum' },
    { label: 'Programs', id: 'programs' },
    { label: 'Quote', id: 'quote' },
    { label: 'Locations', id: 'locations' },
    { label: 'Financials', id: 'financial' },
    { label: 'Impact Levels', id: 'impact-levels' },
    { label: 'Partners', id: 'partners' },
    { label: 'Contact', id: 'footer' },
  ];

  const renderIcon = (id: string): JSX.Element => {
    switch (id) {
      case 'hero':
        return (
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M3 10l9-7 9 7" />
            <path d="M5 21h5v-6h4v6h5" />
          </svg>
        );
      case 'mission':
        return (
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2v8" />
            <circle cx="12" cy="14" r="7" />
          </svg>
        );
      case 'music':
        return (
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M9 3v10" />
            <circle cx="7" cy="18" r="3" />
            <path d="M9 7h8v-4" />
          </svg>
        );
      case 'impact':
        return (
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M4 20V9" />
            <path d="M10 20V5" />
            <path d="M16 20v-8" />
            <path d="M20 20v-5" />
          </svg>
        );
      case 'curriculum':
        return (
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M4 6h14v12H6a2 2 0 0 1-2-2z" />
            <path d="M6 8h10" />
            <path d="M6 12h10" />
          </svg>
        );
      case 'programs':
        return (
          <svg viewBox="0 0 24 24" aria-hidden>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        );
      case 'quote':
        return (
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M7 7h5v5H6v5H2v-4a6 6 0 0 1 5-6z" />
            <path d="M17 7h5v5h-6v5h-4v-4a6 6 0 0 1 5-6z" />
          </svg>
        );
      case 'locations':
        return (
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M12 21s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
        );
      case 'financial':
        return (
          <svg viewBox="0 0 24 24" aria-hidden>
            <circle cx="12" cy="12" r="8" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
          </svg>
        );
      case 'impact-levels':
        return (
          <svg viewBox="0 0 24 24" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        );
      case 'partners':
        return (
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M8 12a4 4 0 1 0 8 0" />
            <path d="M3 7h6v6H3zM15 11h6v6h-6z" />
          </svg>
        );
      case 'footer':
        return (
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M4 8l8 5 8-5" />
            <path d="M4 12v8h16v-8" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" aria-hidden>
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
    }
  };

  return (
    <>
      <header className={`spotify-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-left">
          <button
            type="button"
            className={`menu-button ${menuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div className="pause-icon" />
          </button>
          <div className="logo-container">
            <div className="header-brand">
              <img
                src={gogoWideLogo}
                alt="GOGO Logo"
                style={{
                  height: '60px',
                  width: '180px',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            </div>
          </div>
        </div>

        <div className="header-center">
          <h2 className="header-title">Impact Report</h2>
        </div>
      </header>

      <div className={`side-nav ${menuOpen ? 'open' : ''}`}>
        <nav className="nav-content">
          <div className="nav-section section-group">
            <h3>Sections</h3>
            {navItems.map((item, idx) => (
              <div
                key={`nav-${item.id}`}
                className={`nav-item ${idx === 0 ? 'active' : ''}`}
                onClick={() => navigateTo(item.id)}
                onKeyDown={(e) => e.key === 'Enter' && navigateTo(item.id)}
                role="button"
                tabIndex={0}
              >
                <div className="section-icon">{renderIcon(item.id)}</div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="playlist-section">
            <h3>Playlists</h3>
            <p className="playlist-note">
              Explore featured music in the <strong>Hear our Impact</strong> section below.
            </p>
          </div>
        </nav>
      </div>

      {menuOpen && (
        <div
          className="overlay"
          onClick={toggleMenu}
          onKeyDown={(e) => e.key === 'Enter' && toggleMenu()}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        />
      )}

    </>
  );
}

export default Header;
