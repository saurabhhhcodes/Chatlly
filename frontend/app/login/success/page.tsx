'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function LoginSuccessContent() {
  const searchParams = useSearchParams();
  const provider = searchParams.get('provider');
  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const session = searchParams.get('session');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Set login success in localStorage
    localStorage.setItem('loginSuccess', 'true');
    localStorage.setItem('loginProvider', provider || 'sso');
    if (session) localStorage.setItem('userSession', session);
    if (name) localStorage.setItem('userName', name);
    if (email) localStorage.setItem('userEmail', email);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [provider, name, email, session]);

  const getProviderName = () => {
    switch (provider) {
      case 'google': return 'Google';
      case 'microsoft': return 'Microsoft';
      default: return 'SSO';
    }
  };

  const getProviderIcon = () => {
    if (provider === 'google') {
      return (
        <svg width="32" height="32" viewBox="0 0 24 24">
          <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      );
    } else if (provider === 'microsoft') {
      return (
        <svg width="32" height="32" viewBox="0 0 24 24">
          <path fill="#f25022" d="M1 1h10v10H1z"/>
          <path fill="#00a4ef" d="M13 1h10v10H13z"/>
          <path fill="#7fba00" d="M1 13h10v10H1z"/>
          <path fill="#ffb900" d="M13 13h10v10H13z"/>
        </svg>
      );
    }
    return '✅';
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ 
        maxWidth: 420, 
        width: '100%',
        margin: '20px',
        padding: 40, 
        backgroundColor: 'white',
        borderRadius: 16, 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        textAlign: 'center' 
      }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            backgroundColor: '#dcfce7', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: 32
          }}>
            {getProviderIcon()}
          </div>
          
          <h1 style={{ 
            fontSize: 28, 
            fontWeight: 700, 
            color: '#1f2937', 
            marginBottom: 8 
          }}>
            Welcome!
          </h1>
          
          <p style={{ 
            color: '#6b7280', 
            fontSize: 16,
            marginBottom: 24
          }}>
            You have successfully signed in with {getProviderName()}.
          </p>
          
          {name && (
            <div style={{
              padding: 12,
              backgroundColor: '#f0f9ff',
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 14,
              color: '#0369a1'
            }}>
              Welcome, {name}!
            </div>
          )}

          <div style={{
            padding: 16,
            backgroundColor: '#f0fdf4',
            borderRadius: 12,
            border: '1px solid #bbf7d0',
            marginBottom: 24
          }}>
            <p style={{ 
              color: '#166534', 
              fontSize: 14,
              margin: 0
            }}>
              Redirecting to chat in {countdown} seconds...
            </p>
          </div>
        </div>

        <Link 
          href="/" 
          style={{ 
            display: 'inline-block',
            padding: '12px 24px', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
          }}
        >
          Go to Chat Now
        </Link>
      </div>
    </div>
  );
}

export default function LoginSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginSuccessContent />
    </Suspense>
  );
}