import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

export function HeaderSpacer({ className = "" }) {
  return <div className={`h-16 ${className}`} aria-hidden="true" />;
}

export default function HeaderGlobal({ onBack, backText, children, siteData }) {
  const { t } = useTranslation();
  const brandTitle = typeof siteData?.title === 'string' && siteData.title.trim() ? siteData.title.trim() : 'Maggnn';
  const logoUrl = typeof siteData?.logo_url === 'string' ? siteData.logo_url.trim() : '';
  const logoSrc = logoUrl || '/brand/website_nav_logo.png';

  return (
    <header className="fixed top-0 left-0 right-0 z-[var(--z-header)] bg-surface-base/90 backdrop-blur-md border-b border-border-base pointer-events-auto">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center cursor-pointer relative z-10" onClick={onBack} aria-label={brandTitle}>
          <img
            src={logoSrc}
            alt={brandTitle}
            className="brand-logo w-9 h-9 object-contain"
            draggable="false"
          />
        </Link>

        {children}

        {/* Right Side Actions (only if no children provided, for backward compatibility or simple mode) */}
        {!children && (
            <div className="flex items-center gap-4 relative z-10">
            <LanguageSwitcher />
            {onBack && (
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-base text-content-secondary hover:bg-surface-raised transition-all text-sm font-medium"
                >
                    <ChevronLeft size={16} />
                    <span>{backText || t('auth.back_home')}</span>
                </button>
            )}
            </div>
        )}
      </div>
    </header>
  );
}
