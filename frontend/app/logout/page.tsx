'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function LogoutPage() {
  useEffect(() => {
    // Clear all authentication data
    localStorage.removeItem('loginSuccess');
    localStorage.removeItem('userSession');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('loginProvider');
    
    // Redirect to home after a short delay
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  }, []);

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
        <div style={{ 
          width: 80, 
          height: 80, 
          borderRadius: '50%', 
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: 32
        }}>
          🚪
        </div>
        
        <h1 style={{ 
          fontSize: 28, 
          fontWeight: 700, 
          color: '#1f2937', 
          marginBottom: 8 
        }}>
          Logged Out
        </h1>
        
        <p style={{ 
          color: '#6b7280', 
          fontSize: 16,
          marginBottom: 24
        }}>
          You have been successfully logged out. Redirecting to home...
        </p>

        <Link 
          href="/" 
          style={{ 
            display: 'inline-block',
            padding: '12px 24px', 
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            color: '#374151', 
            textDecoration: 'none', 
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}