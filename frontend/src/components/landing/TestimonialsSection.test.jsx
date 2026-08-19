import '@testing-library/jest-dom/vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TestimonialsSection from './TestimonialsSection';
import { getContent } from '../../api';

vi.mock('../../api', () => ({
  getContent: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: 'en' },
    t: (_key, fallback) => fallback ?? _key,
  }),
}));

describe('TestimonialsSection', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy?.mockRestore();
    vi.clearAllMocks();
  });

  it('renders default testimonials with letter avatars when API fails', async () => {
    getContent.mockRejectedValue(new Error('network'));

    render(<TestimonialsSection />);

    // 默认 testimonials（initial state）应同步渲染
    // 组件在移动端轮播和桌面端网格中各渲染一次，所以会有多个匹配
    expect(screen.getAllByText('Sarah L.').length).toBeGreaterThan(0);
    expect(screen.getAllByText('David K.').length).toBeGreaterThan(0);

    // 组件使用字母头像（首字母），而非 <img> 元素
    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    // 等待 useEffect 中的 fetchContent 异步拒绝完成，避免 unhandled rejection
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load testimonials', expect.any(Error));
    });
  });
});
