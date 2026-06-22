import { useEffect, useRef } from 'react';

export function useScrollReveal<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' },
    );

    el.classList.add('scroll-reveal');
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}