import React, { useState, useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getContent } from '../../api';

const defaultTestimonials = [
  {
    id: 1,
    name: "Sarah L.",
    role: "New user",
    content: "I tried the free daily credits first. The results are structured and the reasoning is easy to follow. The follow-up Q&A is what makes it useful."
  },
  {
    id: 2,
    name: "David K.",
    role: "Business Owner",
    content: "I mainly use it to think through decisions. It doesn't just give a conclusion—it explains why, so I can decide what to take and what to ignore."
  }
];

export default function TestimonialsSection({ contentData }) {
  const { i18n, t } = useTranslation();
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [meta, setMeta] = useState(null);
  const mobileCarouselRef = useRef(null);
  const autoScrollPausedRef = useRef(false);
  const resumeTimerRef = useRef(null);

  useEffect(() => {
    if (contentData) {
      if (contentData.testimonials && contentData.testimonials.length > 0) {
        setTestimonials(contentData.testimonials);
      }
      if (contentData.testimonials_meta) {
        setMeta(contentData.testimonials_meta);
      }
      return;
    }

    const fetchContent = async () => {
      try {
        const content = await getContent(i18n.language);
        if (content) {
            if (content.testimonials && content.testimonials.length > 0) {
                setTestimonials(content.testimonials);
            }
            if (content.testimonials_meta) {
              setMeta(content.testimonials_meta);
            }
        }
      } catch (error) {
        console.error("Failed to load testimonials", error);
      }
    };

    fetchContent();
  }, [i18n.language, contentData]);

  const title = meta?.title || t('landing.testimonials_title', 'Trusted by thousands of seekers.');
  const statsUsers = meta?.stats_users || t('landing.stats_users', 'Users');
  const statsReviews = meta?.stats_reviews || t('landing.stats_reviews', 'Reviews');
  const statsRating = meta?.stats_rating || t('landing.stats_rating', 'Rating');

  useEffect(() => {
    const el = mobileCarouselRef.current;
    if (!el) return;

    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(max-width: 1023px)');
    if (!mq.matches) return;

    const pause = () => {
      autoScrollPausedRef.current = true;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        autoScrollPausedRef.current = false;
      }, 1800);
    };

    const tick = () => {
      if (!mobileCarouselRef.current) return;
      if (autoScrollPausedRef.current) return;
      if (el.scrollWidth <= el.clientWidth + 4) return;

      const firstChild = el.children[0];
      if (!firstChild) return;

      const childWidth = firstChild.getBoundingClientRect().width;
      const styles = getComputedStyle(el);
      const gap =
        parseFloat(styles.columnGap || styles.gap || '0') ||
        parseFloat(styles.rowGap || '0') ||
        0;
      const step = Math.max(1, childWidth + gap);
      const maxScrollLeft = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft + step >= maxScrollLeft - 8) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }

      el.scrollBy({ left: step, behavior: 'smooth' });
    };

    const interval = setInterval(tick, 4200);

    el.addEventListener('pointerdown', pause, { passive: true });
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('wheel', pause, { passive: true });
    el.addEventListener('scroll', pause, { passive: true });

    return () => {
      clearInterval(interval);
      el.removeEventListener('pointerdown', pause);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('wheel', pause);
      el.removeEventListener('scroll', pause);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [i18n.language, testimonials.length, meta?.title]);

  return (
    <section className="py-24 bg-surface-base scroll-mt-24 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 标题 + 数据统计合并 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-content-primary">{title}</h2>
          <div className="flex justify-center gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-brand-text">10k+</div>
              <div className="text-xs text-content-secondary mt-1">{statsUsers}</div>
            </div>
            <div className="w-px bg-border-subtle" />
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-brand-text">5k+</div>
              <div className="text-xs text-content-secondary mt-1">{statsReviews}</div>
            </div>
            <div className="w-px bg-border-subtle" />
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-brand-text">4.9</div>
              <div className="text-xs text-content-secondary mt-1">{statsRating}</div>
            </div>
          </div>
        </div>

        {/* 移动端轮播 */}
        <div
          ref={mobileCarouselRef}
          className="lg:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 px-1 [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="min-w-[80%] sm:min-w-[60%] shrink-0 snap-start bg-surface-sunken/40 p-6 rounded-xl border-0"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-brand-subtle/50 text-brand-text flex items-center justify-center font-bold text-sm">
                  {(testimonial.name || '?').trim().charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-content-primary text-sm truncate">{testimonial.name}</div>
                  <div className="text-xs text-content-tertiary truncate">{testimonial.role}</div>
                </div>
                <div className="ml-auto flex text-functional-warning gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-content-secondary text-sm leading-relaxed [display:-webkit-box] [-webkit-line-clamp:4] [-webkit-box-orient:vertical] overflow-hidden">
                “{testimonial.content}”
              </p>
            </div>
          ))}
        </div>

        {/* 桌面端网格 */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-surface-sunken/40 p-6 rounded-xl border-0"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-brand-subtle/50 text-brand-text flex items-center justify-center font-bold text-sm">
                  {(testimonial.name || '?').trim().charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-content-primary text-sm">{testimonial.name}</div>
                  <div className="text-xs text-content-tertiary">{testimonial.role}</div>
                </div>
                <div className="ml-auto flex text-functional-warning gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-content-secondary text-sm leading-relaxed [display:-webkit-box] [-webkit-line-clamp:6] [-webkit-box-orient:vertical] overflow-hidden">
                “{testimonial.content}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
