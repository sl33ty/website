import React, {useState, useEffect, type ReactNode} from 'react';
import {createPortal} from 'react-dom';
import styles from './BackToTop.module.css';

function ChevronUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

export default function BackToTop(): ReactNode {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, {passive: true});
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <button
      className={`${styles.backToTop} ${visible ? styles.visible : ''}`}
      onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
      aria-label="Back to top"
      type="button"
    >
      <ChevronUpIcon />
    </button>,
    document.body
  );
}
