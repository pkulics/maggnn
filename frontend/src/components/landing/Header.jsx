import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';
import { getContent } from '../../api';
import HeaderGlobal from './HeaderGlobal';
import { useAuthStore } from '../../stores/authStore';

function lockPageScroll() {
  const root = document.documentElement;
  const body = document.body;

  const count = Number(root.dataset.maggnnScrollLockCount || '0');
  if (count === 0) {
    root.dataset.maggnnPrevOverflow = root.style.overflow || '';
    body.dataset.maggnnPrevOverflow = body.style.overflow || '';
  }

  root.dataset.maggnnScrollLockCount = String(count + 1);
  root.style.overflow = 'hidden';
  body.style.overflow = 'hidden';
}

function unlockPageScroll() {
  const root = document.documentElement;
  const body = document.body;

  const count = Number(root.dataset.maggnnScrollLockCount || '0');
  if (count <= 1) {
    const prevRootOverflow = root.dataset.maggnnPrevOverflow ?? '';
    const prevBodyOverflow = body.dataset.maggnnPrevOverflow ?? '';

    root.style.overflow = prevRootOverflow;
    body.style.overflow = prevBodyOverflow;

    root.removeAttribute('data-maggnn-scroll-lock-count');
    root.removeAttribute('data-maggnn-prev-overflow');
    body.removeAttribute('data-maggnn-prev-overflow');
    return;
  }

  root.dataset.maggnnScrollLockCount = String(count - 1);
}

export default function Header({ onLoginClick, onRegisterClick, contentData }) {
  const { i18n, t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [nav, setNav] = useState(null);
  const [siteData, setSiteData] = useState(null);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (contentData && contentData.nav) {
      setNav(contentData.nav);
    }
    if (contentData && contentData.site) {
      setSiteData(contentData.site);
    }
    if (contentData && contentData.nav && contentData.site) return;

    const fetchContent = async () => {
      try {
        const data = await getContent(i18n.language);
        if (data && data.nav) {
          setNav(data.nav);
        }
        if (data && data.site) {
          setSiteData(data.site);
        }
      } catch (e) {
        console.error("Failed to load nav content", e);
      }
    };
    fetchContent();
  }, [i18n.language, contentData]);

  useEffect(() => {
    if (!isMenuOpen) return;

    lockPageScroll();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      unlockPageScroll();
    };
  }, [isMenuOpen]);

  const navLogin = t('nav.login');
  const navRegister = t('nav.register');

  const renderNavItems = () => {
    if (Array.isArray(nav)) {
      return nav.map((item, idx) => (
        <Link
          key={idx}
          to={item.path}
          className="text-sm font-medium text-content-secondary hover:text-content-primary transition-colors"
        >
          {item.name}
        </Link>
      ));
    }

    return (
      <>
        <Link to="/home" className="text-sm font-medium text-content-secondary hover:text-content-primary transition-colors">{t('nav.home')}</Link>
        <Link to="/product" className="text-sm font-medium text-content-secondary hover:text-content-primary transition-colors">{t('nav.product')}</Link>
        <Link to="/about" className="text-sm font-medium text-content-secondary hover:text-content-primary transition-colors">{t('nav.about')}</Link>
      </>
    );
  };

  const renderMobileNavItems = () => {
     if (Array.isArray(nav)) {
      return nav.map((item, idx) => (
        <Link
            key={idx}
            to={item.path}
            className="text-sm font-medium py-2 text-content-primary"
            onClick={() => setIsMenuOpen(false)}
        >
          {item.name}
        </Link>
      ));
    }
    return (
        <>
          <Link to="/home" className="text-sm font-medium py-2 text-content-primary" onClick={() => setIsMenuOpen(false)}>{t('nav.home')}</Link>
          <Link to="/product" className="text-sm font-medium py-2 text-content-primary" onClick={() => setIsMenuOpen(false)}>{t('nav.product')}</Link>
          <Link to="/about" className="text-sm font-medium py-2 text-content-primary" onClick={() => setIsMenuOpen(false)}>{t('nav.about')}</Link>
        </>
    );
  }

  return (
    <>
      <HeaderGlobal siteData={siteData}>
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {renderNavItems()}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
           <LanguageSwitcher />
           {user ? (
            <button 
              onClick={() => navigate('/')}
              className="bg-brand-main hover:bg-brand-hover text-brand-surface rounded-full p-3 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
              title={t('common.back_to_chat') || 'Back to Chat'}
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          ) : (
             <>
              <button 
                onClick={onLoginClick}
                className="text-content-secondary hover:text-content-primary font-medium px-4 py-2 rounded-lg hover:bg-surface-sunken transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
              >
                {navLogin}
              </button>
              <button 
                onClick={onRegisterClick}
                className="bg-brand-main hover:bg-brand-hover text-brand-surface rounded-full px-6 py-2 font-semibold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
              >
                {navRegister}
              </button>
             </>
           )}
        </div>

        <div className="lg:hidden flex items-center gap-2">
          {!user && onLoginClick && (
            <button
              onClick={onLoginClick}
              className="hidden sm:inline-flex items-center justify-center px-3 py-2 rounded-full border border-border-base text-content-secondary hover:bg-surface-raised transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
            >
              {navLogin}
            </button>
          )}
          <button 
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="p-2 text-content-tertiary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </HeaderGlobal>

      {/* Mobile Menu - Outside of HeaderGlobal but fixed position */}
      {isMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-[var(--z-drawer)] bg-surface-overlay/20 backdrop-blur-sm"
            data-testid="mobile-menu-backdrop"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="lg:hidden fixed top-16 left-0 right-0 z-[var(--z-drawer)] bg-surface-base border-b border-border-subtle p-4 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-5 max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain">
            {renderMobileNavItems()}
            <div className="h-px bg-border-subtle my-2" />
            <div className="px-4 py-2">
              <LanguageSwitcher variant="list" />
            </div>
            {user ? (
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/');
                }}
                className="w-full bg-brand-main text-brand-surface rounded-full py-3 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
              >
                {t('common.dashboard') || 'Dashboard'}
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLoginClick();
                  }}
                  className="w-full px-4 py-3 rounded-full border border-border-base text-content-primary bg-surface-base hover:bg-surface-sunken transition-colors text-xs sm:text-sm font-semibold whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
                >
                  {navLogin}
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (onRegisterClick) onRegisterClick();
                  }}
                  className="w-full px-4 py-3 rounded-full bg-brand-main hover:bg-brand-hover text-brand-surface transition-colors text-xs sm:text-sm font-semibold whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
                >
                  {navRegister}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
