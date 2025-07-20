import React from 'react';
import styles from './MenuButton.module.css';

interface MenuButtonProps {
  onClick: () => void;
  className?: string;
}

export function MenuButton({ onClick, className = '' }: MenuButtonProps) {
  return (
    <button
      className={`${styles.menuButton} ${className}`}
      onClick={onClick}
      aria-label="Open menu"
    >
      <div className={styles.hamburger}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>
  );
} 