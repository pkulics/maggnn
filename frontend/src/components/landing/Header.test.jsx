import '@testing-library/jest-dom/vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import HeaderGlobal from './HeaderGlobal';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: 'en' },
    t: (key) => key,
  }),
}));

vi.mock('../../stores/authStore', () => ({
  useAuthStore: (selector) => selector({ user: null }),
}));

vi.mock('../LanguageSwitcher', () => ({
  default: ({ variant }) => <div data-testid={`language-switcher-${variant || 'icon'}`} />
}));

describe('Header (mobile menu)', () => {
  it('locks body scroll when opened and restores when closed', () => {
    const onLoginClick = vi.fn();
    const onRegisterClick = vi.fn();

    document.body.style.overflow = 'auto';

    render(
      <MemoryRouter>
        <Header onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} contentData={{ nav: [] }} />
      </MemoryRouter>
    );

    const openBtn = screen.getByLabelText('Open menu');
    fireEvent.click(openBtn);
    expect(document.body.style.overflow).toBe('hidden');

    const backdrop = screen.getByTestId('mobile-menu-backdrop');
    fireEvent.click(backdrop);
    expect(document.body.style.overflow).toBe('auto');
  });

  it('closes on Escape', () => {
    render(
      <MemoryRouter>
        <Header onLoginClick={() => {}} onRegisterClick={() => {}} contentData={{ nav: [] }} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText('Open menu'));
    expect(screen.getByTestId('mobile-menu-backdrop')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByTestId('mobile-menu-backdrop')).not.toBeInTheDocument();
  });
});

describe('HeaderGlobal', () => {
  it('shows back button when onBack is provided', () => {
    render(
      <MemoryRouter>
        <HeaderGlobal onBack={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText('auth.back_home')).toBeInTheDocument();
  });
});
