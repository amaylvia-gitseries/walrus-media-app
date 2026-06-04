import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { verifyWallet, getWalletHistory } from '../tatum';

export default function VerifyPage() {
  const { walletAddress } = useParams();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!walletAddress) {
      setError('No wallet address provided.');
      setLoading(false);
      return;
    }
    loadWalletData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  async function loadWalletData() {
    setLoading(true);
    setError('');
    try {
      const [walletData, txData] = await Promise.all([
        verifyWallet(walletAddress),
        getWalletHistory(walletAddress),
      ]);

      setWallet(walletData);

      const txList = Array.isArray(txData?.data)
        ? txData.data
        : Array.isArray(txData)
        ? txData
        : [];
      setTransactions(txList);

      // Run AI analysis after data loads
      await runAnalysis(walletAddress, txList);
    } catch (e) {
      console.error('Error loading wallet:', e);
      setError('Failed to load wallet data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function runAnalysis(address, txList) {
    setAnalysisLoading(true);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `You are a blockchain credibility analyzer for the Creda app. 
Analyze this Sui wallet and determine if it is credible/trustworthy.

Wallet Address: ${address}
Total Transactions: ${txList.length}
Recent Transactions (up to 5): ${JSON.stringify(txList.slice(0, 5), null, 2)}

Provide a short, clear credibility verdict:
1. A credibility score out of 100
2. A 2-3 sentence summary of the wallet's activity
3. A final verdict: CREDIBLE, SUSPICIOUS, or INSUFFICIENT DATA

Keep it concise and friendly.`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data?.content?.[0]?.text || 'Unable to generate analysis.';
      setAnalysis(text);
    } catch (e) {
      console.error('Analysis error:', e);
      setAnalysis('AI analysis unavailable. Please check your API key configuration.');
    } finally {
      setAnalysisLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Verifying wallet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <p style={styles.errorText}>⚠️ {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🔍 Wallet Verification</h1>
        <p style={styles.subtitle}>Powered by Creda × Tatum × Sui</p>
      </div>

      {/* Wallet Info Card */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Wallet Details</h2>
        <div style={styles.row}>
          <span style={styles.label}>Address</span>
          <span style={styles.value}>
            {walletAddress?.slice(0, 10)}...{walletAddress?.slice(-6)}
          </span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Network</span>
          <span style={styles.value}>{wallet?.network || 'Sui Mainnet'}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Balance</span>
          <span style={styles.value}>{wallet?.balance || '0'} SUI</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Status</span>
          <span style={{ ...styles.value, color: '#22c55e', fontWeight: 700 }}>
            ✅ Verified
          </span>
        </div>
      </div>

      {/* Transactions Card */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          Transactions ({transactions.length})
        </h2>
        {transactions.length === 0 ? (
          <p style={styles.emptyText}>No transactions found for this wallet.</p>
        ) : (
          <div style={styles.txList}>
            {transactions.slice(0, 10).map((tx, i) => (
              <div key={i} style={styles.txItem}>
                <span style={styles.txIndex}>#{i + 1}</span>
                <span style={styles.txHash}>
                  {typeof tx === 'string'
                    ? `${tx.slice(0, 12)}...`
                    : tx?.digest
                    ? `${tx.digest.slice(0, 12)}...`
                    : `Transaction ${i + 1}`}
                </span>
              </div>
            ))}
            {transactions.length > 10 && (
              <p style={styles.moreText}>+ {transactions.length - 10} more transactions</p>
            )}
          </div>
        )}
      </div>

      {/* AI Analysis Card */}
      <div style={{ ...styles.card, borderColor: '#6366f1' }}>
        <h2 style={styles.cardTitle}>🤖 AI Credibility Analysis</h2>
        {analysisLoading ? (
          <div style={styles.analysisLoading}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Analyzing wallet activity...</p>
          </div>
        ) : (
          <p style={styles.analysisText}>{analysis}</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    color: '#f1f1f1',
    padding: '24px 16px',
    fontFamily: "'Courier New', monospace",
    maxWidth: '680px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#ffffff',
    margin: 0,
  },
  subtitle: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '6px',
  },
  card: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #2d2d2d',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#e5e7eb',
    marginBottom: '16px',
    marginTop: 0,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '10px',
    marginBottom: '10px',
    borderBottom: '1px solid #2d2d2d',
  },
  label: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  value: {
    fontSize: '13px',
    color: '#f1f1f1',
    wordBreak: 'break-all',
    textAlign: 'right',
    maxWidth: '60%',
  },
  txList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  txItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#111',
    padding: '10px 12px',
    borderRadius: '8px',
  },
  txIndex: {
    fontSize: '11px',
    color: '#6b7280',
    minWidth: '28px',
  },
  txHash: {
    fontSize: '13px',
    color: '#a5b4fc',
    fontFamily: 'monospace',
  },
  moreText: {
    fontSize: '12px',
    color: '#6b7280',
    textAlign: 'center',
    marginTop: '8px',
  },
  emptyText: {
    fontSize: '13px',
    color: '#6b7280',
    textAlign: 'center',
    padding: '16px 0',
  },
  analysisText: {
    fontSize: '14px',
    color: '#d1d5db',
    lineHeight: '1.7',
    whiteSpace: 'pre-wrap',
  },
  analysisLoading: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '16px',
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: '14px',
  },
  spinner: {
    width: '24px',
    height: '24px',
    border: '3px solid #2d2d2d',
    borderTop: '3px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  errorBox: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #ef4444',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    margin: '40px auto',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '14px',
  },
};