import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { verifyWallet, getWalletHistory } from '../tatum';

export default function VerifyPage() {
  const { walletAddress } = useParams();
  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [walletData, txHistory] = await Promise.all([
          verifyWallet(walletAddress),
          getWalletHistory(walletAddress)
        ]);
        setWallet(walletData);
        setHistory(txHistory?.data || []);
        console.log('History data', JSON.stringify(txHistory));
        console.log('Tatum response:', JSON.stringify(txHistory));
        await analyzeWallet(walletAddress, txHistory?.data || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, [walletAddress]);

  async function analyzeWallet(address, transactions) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
       },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `You are a crypto wallet analyst for degen investors. Be brief and direct.
          
Wallet: ${address}
Total transactions: ${transactions.length}
First tx: ${transactions[transactions.length - 1]?.timestamp || 'unknown'}
Recent activity: ${JSON.stringify(transactions.slice(0, 5))}

Give exactly 3 lines:
1. Activity: (how long active, consistency)
2. Red flags: (suspicious patterns or "None detected")
3. Trust score: X/10`
        }]
      })
    });
    const data = await response.json();
    setAnalysis(data.content[0].text);
  }

  if (loading) return (
    <div style={styles.container}>
      <p style={styles.loading}>Analyzing wallet...</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Wallet Verify</h1>

      {/* Wallet Info */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>✅ Verified Wallet</h2>
        <p style={styles.address}>{wallet?.address}</p>
        <p style={styles.detail}>Balance: {wallet?.balance} SUI</p>
        <p style={styles.detail}>Network: {wallet?.network}</p>
      </div>

      {/* AI Analysis */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🤖 AI Analysis</h2>
        <p style={styles.analysis}>{analysis || 'Generating analysis...'}</p>
      </div>

      {/* Transaction History */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📊 Transaction History ({history.length})</h2>
        {history.slice(0, 10).map((tx, i) => (
  <div key={i} style={styles.tx}>
    <p style={styles.txHash}>{typeof tx === 'string' ? tx.slice(0, 20) : tx?.digest?.slice(0, 20)}...</p>
    <p style={styles.txDetail}>Transaction confirmed on Sui</p>
  </div>
))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 600, margin: '0 auto', padding: 20, fontFamily: 'monospace', background: '#0a0a0a', minHeight: '100vh', color: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#00ff88' },
  card: { background: '#111', border: '1px solid #222', borderRadius: 8, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#00ff88' },
  address: { fontSize: 12, color: '#888', wordBreak: 'break-all' },
  detail: { fontSize: 14, color: '#ccc', marginTop: 4 },
  analysis: { fontSize: 14, color: '#ccc', lineHeight: 1.6, whiteSpace: 'pre-line' },
  loading: { color: '#00ff88', textAlign: 'center', marginTop: 100 },
  tx: { borderBottom: '1px solid #222', paddingBottom: 8, marginBottom: 8 },
  txHash: { fontSize: 12, color: '#888' },
  txDetail: { fontSize: 11, color: '#555' }
};