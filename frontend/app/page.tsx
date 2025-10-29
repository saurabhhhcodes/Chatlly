'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api';
const TOKEN = process.env.NEXT_PUBLIC_BEARER_TOKEN || '';
if (!TOKEN) {
  console.warn('⚠ Missing NEXT_PUBLIC_BEARER_TOKEN; requests will be unauthorized.');
}

type Citation = { id: string; meta: any };
type ChatResponse = { answer: string; citations?: Citation[] };

export default function Page() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string>('');
  const [cites, setCites] = useState<Citation[]>([]);
  const [uploading, setUploading] = useState(false);
  const [useAgent, setUseAgent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<{name?: string, email?: string} | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const loginSuccess = localStorage.getItem('loginSuccess');
      const userSession = localStorage.getItem('userSession');
      const userName = localStorage.getItem('userName');
      const userEmail = localStorage.getItem('userEmail');
      
      if (loginSuccess === 'true') {
        setIsLoggedIn(true);
        
        // First try to use stored user info
        if (userName || userEmail) {
          setUserInfo({ 
            name: userName || userEmail || 'User',
            email: userEmail 
          });
          return;
        }
        
        // Fallback to API call if session exists
        if (userSession) {
          try {
            const res = await fetch(`${API_BASE}/me?session=${userSession}`, {
              headers: { 'Authorization': `Bearer ${TOKEN}` }
            });
            if (res.ok) {
              const user = await res.json();
              setUserInfo({ 
                name: user.name || user.email || 'User',
                email: user.email 
              });
            } else {
              setUserInfo({ name: 'User' });
            }
          } catch (err) {
            setUserInfo({ name: 'User' });
          }
        } else {
          setUserInfo({ name: 'User' });
        }
      }
    };
    
    checkAuth();
  }, []);

  const ask = async () => {
    if (!query.trim()) return;
    setAnswer('');
    setCites([]);
    setLoading(true);

    try {
      const url = useAgent ? `${API_BASE}/agent-chat` : `${API_BASE}/chat`;
      const payload = useAgent ? { query } : { query, top_k: 5 };

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      const data: ChatResponse = await res.json();
      setAnswer(data.answer || '(no answer returned)');
      setCites(data.citations || []);
    } catch (err) {
      console.error(err);
      setAnswer('❌ Error: Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${TOKEN}` },
        body: form,
      });

      const text = await res.text();
      alert(`✅ Ingested: ${text}`);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to ingest file');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 16, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: 24,
        padding: '20px 0',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            fontSize: 32, 
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: 8,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🧠 Agentic Knowledge Assistant
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: 16,
            lineHeight: 1.6,
            marginBottom: 0,
            maxWidth: '600px'
          }}>
            Upload PDFs, CSVs, DOCX or TXT, then ask questions. Toggle <b>Agent Mode</b> to enable multi-step reasoning with AI.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {isLoggedIn && userInfo && (
            <div style={{
              padding: '8px 16px',
              backgroundColor: '#dcfce7',
              border: '1px solid #bbf7d0',
              borderRadius: 8,
              fontSize: 14,
              color: '#166534'
            }}>
              ✅ Welcome, {userInfo.name || userInfo.email || 'User'}!
            </div>
          )}
          
          <Link 
            href={isLoggedIn ? "/logout" : "/login"}
            style={{ 
              padding: '12px 20px', 
              background: isLoggedIn 
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {isLoggedIn ? '🚪 Logout' : '🔐 Login with SSO'}
          </Link>
        </div>
      </div>

      {/* File Upload */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}></div>
        <label style={{ border: '1px solid #ddd', padding: 8, borderRadius: 8, cursor: 'pointer' }}>
          Upload File (PDF/CSV/DOCX/TXT)
          <input type="file" accept=".pdf,.csv,.docx,.txt" style={{ display: 'none' }} onChange={upload} />
        </label>
        {uploading && <span>📤 Uploading…</span>}
         <Link
          href="/uploads"
          style={{
            marginLeft: 'auto',
            border: '1px solid rgb(221, 221, 221)',
            padding: '8px',
            borderRadius: 8,
            textDecoration: 'none',
            background: 'white',
            color: 'black',
          }}
        >
          View uploaded files
        </Link>
      </div>

      {/* Query Box */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question…"
          style={{ flex: 1, padding: 12, border: '1px solid #ddd', borderRadius: 8 }}
          onKeyDown={(e) => e.key === 'Enter' && ask()}
        />
        <button onClick={ask} disabled={loading} style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid #111' }}>
          {loading ? 'Thinking…' : 'Ask'}
        </button>
      </div>

      {/* Agent toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        <input type="checkbox" checked={useAgent} onChange={(e) => setUseAgent(e.target.checked)} />
        <label>Use Agent Mode (AgentKit)</label>
      </div>

      {/* Answer Section */}
      {answer && (
        <div style={{ marginTop: 24, padding: 16, border: '1px solid #eee', borderRadius: 12, background: '#fafafa' }}>
          <h3>Answer</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{answer}</p>

          {cites.length > 0 && (
            <>
              <h4 style={{ marginTop: 16 }}>Citations</h4>
              <ul>
                {cites.map((c, i) => (
                  <li key={i}>
                    <code>{c.id}</code>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>{JSON.stringify(c.meta)}</div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}