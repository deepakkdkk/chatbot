"use client";

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MenuButton } from '../ui/MenuButton';
import { useAuth } from '@/contexts/AuthContext';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={styles.layout}>
      {/* Header with menu button */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <MenuButton onClick={handleMenuClick} className={styles.menuButton} />
          <h1 className={styles.title}>AI Chatbot</h1>
          <div className={styles.headerRight}>
            {user && (
              <div className={styles.userInfo}>
                <span>{user.name}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={styles.main}>
        {children}
      </main>

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={handleSidebarClose}
      />
    </div>
  );
} 