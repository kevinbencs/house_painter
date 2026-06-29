'use client'
import { useEffect, useRef, useState } from 'react';

export function useScrollReveal(options = { threshold: 0.15 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(el); // remove this line to re-trigger every scroll
      }
    }, options);

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return {ref, isVisible};
}