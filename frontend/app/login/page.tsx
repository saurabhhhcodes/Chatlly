'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = isSignup ? '/signup' : '/login';
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('loginSuccess', 'true');
        localStorage.setItem('userSession', data.session);
        localStorage.setItem('userName', formData.name || formData.email);
        window.location.href = '/';
      } else {
        alert(data.detail || 'Authentication failed');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'white',
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
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ 
            fontSize: 32, 
            fontWeight: 700, 
            color: '#1f2937', 
            marginBottom: 8 
          }}>
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: 16,
            margin: 0
          }}>
            {isSignup ? 'Sign up for your Agentic Knowledge Assistant' : 'Sign in to access your Agentic Knowledge Assistant'}
          </p>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{ 
                width: '100%', 
                padding: 12, 
                marginBottom: 12, 
                border: '1px solid #d1d5db', 
                borderRadius: 8,
                fontSize: 16
              }}
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            style={{ 
              width: '100%', 
              padding: 12, 
              marginBottom: 12, 
              border: '1px solid #d1d5db', 
              borderRadius: 8,
              fontSize: 16
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            style={{ 
              width: '100%', 
              padding: 12, 
              marginBottom: 16, 
              border: '1px solid #d1d5db', 
              borderRadius: 8,
              fontSize: 16
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: 12, 
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              color: '#374151', 
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        {/* Toggle Sign Up/Sign In */}
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignup(!isSignup)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#374151', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: 24 
        }}>
          <div style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }}></div>
          <span style={{ margin: '0 16px', color: '#6b7280', fontSize: 14 }}>OR</span>
          <div style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }}></div>
        </div>

        {/* SSO Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          <a 
            href={`${API_BASE}/login/google`} 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: '14px 20px', 
              border: '2px solid #e5e7eb', 
              borderRadius: 12, 
              textDecoration: 'none', 
              color: '#374151',
              fontSize: 16,
              fontWeight: 500,
              transition: 'all 0.2s',
              backgroundColor: 'white'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </a>

          <a 
            href={`${API_BASE}/login/microsoft`} 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: '14px 20px', 
              border: '2px solid #e5e7eb', 
              borderRadius: 12, 
              textDecoration: 'none', 
              color: '#374151',
              fontSize: 16,
              fontWeight: 500,
              transition: 'all 0.2s',
              backgroundColor: 'white'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#f25022" d="M1 1h10v10H1z"/>
              <path fill="#00a4ef" d="M13 1h10v10H13z"/>
              <path fill="#7fba00" d="M1 13h10v10H1z"/>
              <path fill="#ffb900" d="M13 13h10v10H13z"/>
            </svg>
            Continue with Microsoft
          </a>
        </div>

        <div style={{ 
          paddingTop: 24, 
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8
        }}>
          <span style={{ color: '#6b7280', fontSize: 14 }}>
            Want to try without signing in?
          </span>
          <Link 
            href="/" 
            style={{ 
              color: '#374151', 
              textDecoration: 'none', 
              fontSize: 14,
              fontWeight: 500
            }}
          >
            Continue as Guest
          </Link>
        </div>
      </div>
    </div>
  );
}