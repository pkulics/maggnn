import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getContent } from '../../api';

export default function Footer({ contentData }) {
  const { t, i18n } = useTranslation();
  const [links, setLinks] = useState([]);
  const [footerMeta, setFooterMeta] = useState(null);
  const [siteData, setSiteData] = useState(null);

  useEffect(() => {
    if (contentData) {
      if (contentData.links) setLinks(contentData.links);
      if (contentData.footer) setFooterMeta(contentData.footer);
      if (contentData.site) setSiteData(contentData.site);
      if (contentData.links && contentData.footer && contentData.site) return;
    }

    const fetchContent = async () => {
      try {
        const content = await getContent(i18n.language);
        if (content) {
          if (content.links) setLinks(content.links);
          if (content.footer) setFooterMeta(content.footer);
          if (content.site) setSiteData(content.site);
        }
      } catch (error) {
        console.error("Failed to load footer content", error);
      }
    };
    
    fetchContent();
  }, [i18n.language, contentData]);

  const linksTitle = footerMeta?.links_title !== undefined ? footerMeta.links_title : t('landing.footer_links');
  const brandTitle = typeof siteData?.title === 'string' && siteData.title.trim() ? siteData.title.trim() : 'Maggnn';
  const description = footerMeta?.description || siteData?.footer_description || siteData?.intro_text || t('landing.footer_desc');
  const disclaimer = footerMeta?.disclaimer || siteData?.footer_disclaimer || t('landing.footer_disclaimer', 'Disclaimer: This site is for entertainment and cultural educational purposes only. Content does not constitute prediction or commitment.');
  const copyrightText =
    typeof siteData?.copyright_text === 'string' && siteData.copyright_text.trim()
      ? siteData.copyright_text.trim()
      : `${brandTitle}. All rights reserved.`;
  const logoUrl = typeof siteData?.logo_url === 'string' ? siteData.logo_url.trim() : '';
  const logoSrc = logoUrl || '/brand/website_footer_logo.png';

  return (
    <footer className="bg-surface-base text-content-primary py-12 border-t border-border-subtle">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-6">
              <img
                src={logoSrc}
                alt={brandTitle}
                className="w-8 h-8 object-contain brand-logo"
              />
            </div>
            <p className="text-content-secondary text-sm leading-relaxed">
              {description}
            </p>
            <p className="text-content-muted text-xs mt-4 italic border-t border-border-subtle pt-4">
              {disclaimer}
            </p>
          </div>

          {/* Links Container */}
          <div className="flex gap-8 md:gap-16">
            <div>
              {linksTitle && <h4 className="font-bold mb-4 text-content-primary">{linksTitle}</h4>}
              <ul className="space-y-2 text-sm text-content-secondary">
                {links.map((link, idx) => (
                    <li key={idx}>
                        <Link to={link.url} className="hover:text-content-primary transition-colors">{link.label}</Link>
                    </li>
                ))}
                {links.length === 0 && (
                    <>
                        <li><Link to="/about" className="hover:text-content-primary transition-colors">{t('landing.footer_fallback_links.contact')}</Link></li>
                        <li><Link to="/privacy" className="hover:text-content-primary transition-colors">{t('landing.footer_fallback_links.privacy')}</Link></li>
                        <li><Link to="/refund" className="hover:text-content-primary transition-colors">{t('landing.footer_fallback_links.refund')}</Link></li>
                    </>
                )}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border-base mt-12 pt-8 text-center text-sm text-content-muted">
          © {new Date().getFullYear()} {copyrightText}
        </div>
      </div>
    </footer>
  );
}
