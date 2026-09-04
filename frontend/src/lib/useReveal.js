import { useEffect } from 'react';

/**
 * Global scroll-reveal: watches every `.reveal` element (including ones
 * added later) and adds `.is-revealed` when it enters the viewport.
 * Elements may set `--reveal-delay` for staggered entrances.
 */
export function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const observeAll = () => {
      document.querySelectorAll('.reveal:not(.is-revealed)').forEach((el) => observer.observe(el));
    };

    observeAll();
    const mutation = new MutationObserver(observeAll);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);
}

export default useReveal;
