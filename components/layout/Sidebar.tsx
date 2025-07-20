"use client";

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, login, signup, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'profile'>('login');
  const [authError, setAuthError] = useState<string>('');

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className={styles.overlay} onClick={handleOverlayClick}>
          <div className={styles.sidebar}>
            <div className={styles.header}>
              <h2>Menu</h2>
              <button className={styles.closeButton} onClick={onClose}>
                ×
              </button>
            </div>

            <div className={styles.content}>
              {user ? (
                // User is logged in - show profile
                <div className={styles.profileSection}>
                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className={styles.userDetails}>
                      <h3>{user.name}</h3>
                      <p>{user.email}</p>
                    </div>
                  </div>
                  
                  <div className={styles.profileActions}>
                    <Button variant="secondary" size="sm" className={styles.actionButton}>
                      Edit Profile
                    </Button>
                    <Button variant="ghost" size="sm" className={styles.actionButton}>
                      Settings
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={styles.actionButton}
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                // User is not logged in - show auth options
                <div className={styles.authSection}>
                  <div className={styles.tabs}>
                    <button
                      className={`${styles.tab} ${activeTab === 'login' ? styles.active : ''}`}
                      onClick={() => setActiveTab('login')}
                    >
                      Login
                    </button>
                    <button
                      className={`${styles.tab} ${activeTab === 'signup' ? styles.active : ''}`}
                      onClick={() => setActiveTab('signup')}
                    >
                      Sign Up
                    </button>
                  </div>

                  <div className={styles.tabContent}>
                    {authError && (
                      <div className={styles.error}>
                        {authError}
                      </div>
                    )}
                    
                    {activeTab === 'login' && (
                      <LoginForm onSuccess={onClose} onError={setAuthError} />
                    )}
                    {activeTab === 'signup' && (
                      <SignupForm onSuccess={onClose} onError={setAuthError} />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface AuthFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

function LoginForm({ onSuccess, onError }: AuthFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onError('');

    try {
      await login(email, password);
      onSuccess();
    } catch (error) {
      onError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
          disabled={loading}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
          disabled={loading}
        />
      </div>

      <Button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}

function SignupForm({ onSuccess, onError }: AuthFormProps) {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onError('');

    try {
      await signup(name, email, password);
      onSuccess();
    } catch (error) {
      onError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="signup-name">Name</label>
        <input
          id="signup-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={styles.input}
          disabled={loading}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
          disabled={loading}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
          disabled={loading}
        />
      </div>

      <Button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </Button>
    </form>
  );
} 