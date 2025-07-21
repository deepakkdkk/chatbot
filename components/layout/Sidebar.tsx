"use client";

import React, { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '../ui/Button';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'profile'>('login');
  const [authError, setAuthError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setAuthError('');
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      setAuthError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
    onClose();
  };

  if (status === 'loading') {
    return (
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.sidebar}>
          <div className={styles.header}>
            <h2>Menu</h2>
            <button className={styles.closeButton} onClick={onClose}>×</button>
          </div>
          <div className={styles.content}>
            <div className={styles.loading}>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

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
              {session?.user ? (
                // User is logged in - show profile
                <div className={styles.profileSection}>
                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                      {session.user.image ? (
                        <img src={session.user.image} alt={session.user.name || 'User'} />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          {session.user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div className={styles.userDetails}>
                      <h3>{session.user.name || 'User'}</h3>
                      <p>{session.user.email}</p>
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
                    
                    <div className={styles.socialAuth}>
                      <Button 
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className={styles.googleButton}
                      >
                        {loading ? 'Signing in...' : 'Continue with Google'}
                      </Button>
                    </div>

                    <div className={styles.divider}>
                      <span>or</span>
                    </div>
                    
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        onError('Invalid email or password.');
      } else {
        onSuccess();
      }
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onError('');

    try {
      const result = await signIn('credentials', {
        name,
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        onError('Signup failed. Please try again.');
      } else {
        onSuccess();
      }
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