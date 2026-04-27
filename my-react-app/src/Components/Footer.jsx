import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: '#000',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '2rem 0',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>

        {/* Logo/Brand */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: '1px solid rgba(34,197,94,0.3)',
            background: 'rgba(34,197,94,0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              fontFamily: "'Hattrick', sans-serif",
              fontSize: 16,
              color: '#22c55e',
              textShadow: '0 0 12px rgba(34,197,94,0.5)'
            }}>C</span>
          </div>
          <span style={{
            fontFamily: "'Hattrick', sans-serif",
            fontSize: 18,
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.9)'
          }}>CRED</span>
        </div>

        {/* Navigation Links */}
        <nav style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center'
        }}>
          {[
            { label: 'Home', to: '/' },
            { label: 'About', to: '/about' },
            { label: 'Services', to: '/services' },
            { label: 'Contact', to: '/contact' }
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                fontSize: '0.85rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: isActive ? '#22c55e' : 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                padding: '0.25rem 0'
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Social Links */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {[
            { icon: '𝕏', label: 'Twitter' },
            { icon: 'in', label: 'LinkedIn' },
            { icon: '𝔾', label: 'GitHub' }
          ].map((social) => (
            <a
              key={social.label}
              href="#"
              aria-label={social.label}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                target.style.borderColor = 'rgba(34,197,94,0.4)';
                target.style.background = 'rgba(34,197,94,0.05)';
                target.style.color = '#22c55e';
                target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget;
                target.style.borderColor = 'rgba(255,255,255,0.1)';
                target.style.background = 'rgba(255,255,255,0.02)';
                target.style.color = 'rgba(255,255,255,0.5)';
                target.style.transform = 'scale(1)';
              }}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Bottom Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          width: '100%'
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.4)',
            textAlign: 'center',
            margin: 0,
            letterSpacing: '0.02em'
          }}>
            © {currentYear} CRED. All rights reserved. | Built with precision and care.
          </p>

          {/* Status Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 8px rgba(34,197,94,0.6)',
              animation: 'pulse 2s ease-in-out infinite'
            }} />
            <span style={{
              fontSize: '0.7rem',
              color: 'rgba(34,197,94,0.7)',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              System Online
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(34,197,94,0.6); }
          50% { opacity: 0.5; box-shadow: 0 0 16px rgba(34,197,94,0.3); }
        }

        @media (max-width: 768px) {
          footer > div {
            padding: 0 1rem;
          }

          nav {
            flex-wrap: wrap;
            gap: 1rem !important;
          }

          nav a {
            font-size: 0.8rem !important;
          }
        }
      `}</style>
    </footer>
  );
}

