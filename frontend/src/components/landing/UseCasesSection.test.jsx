import '@testing-library/jest-dom/vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import UseCasesSection from './UseCasesSection';
import { getContent } from '../../api';

vi.mock('../../api', () => ({
  getContent: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: 'en' },
    t: (key) => key,
  }),
}));

describe('UseCasesSection', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy?.mockRestore();
    vi.clearAllMocks();
  });

  it('calls onCtaClick when the CTA card button is clicked', async () => {
    getContent.mockResolvedValue({
      use_cases: {
        title: 'Use Cases',
        subtitle: 'Subtitle',
        items: [],
        cta_card: {
          title: 'CTA',
          description: 'Desc',
          button: 'Get started',
        },
      },
    });

    const onCtaClick = vi.fn();

    render(<UseCasesSection onCtaClick={onCtaClick} />);

    const buttons = await screen.findAllByRole('button', { name: 'Get started' });
    fireEvent.click(buttons[0]);

    expect(onCtaClick).toHaveBeenCalledTimes(1);
  });
});
