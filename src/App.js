import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { publishPost } from './walrus';
import VerifyPage from './components/VerifyPage';
import './App.css';

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="landing">
      <div className="logo">creda</div>
      <p className="tagline">Verify your team's credibility on-chain</p>
      <div className="hero-buttons">
        <button className="btn-primary" onClick={() => navigate('/publish')}>
          Publish Post
        </button>
        <button className="btn-secondary" onClick={() => navigate('/feed')}>
          View Feed
        </button>
      </div>
      <div className="stats">
        <div className="stat">
          <div className="stat-number">∞</div>
          <div className="stat-label">Permanent Storage</div>
        </div>
        <div className="stat">
          <div className="stat-number">0x</div>
          <div className="stat-label">Wallet Verified</div>
        </div>
        <div className="stat">
          <div className="stat-number">AI</div>
          <div className="stat-label">Trust Analysis</div>
        </div>
      </div>
      <div className="powered">
        <span className="badge">⚡ Powered by Walrus</span>
        <span className="badge">◎ Sui Network</span>
        <span className="badge">⚡ Tatum RPC</span>
      </div>
    </div>
  );
}

function PublishPage() {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (!wallet || !title || !content) return alert('Fill in all fields');
    setLoading(true);
    try {
      const { blobId } = await publishPost(title, content, wallet);
      alert('Published! Blob ID: ' + blobId);
      navigate('/feed');
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <div className="page-logo">creda</div>
      </div>
      <div className="card">
        <div className="card-title">Publish On-Chain</div>
        <input placeholder="Your Sui wallet address" value={wallet} onChange={e => setWallet(e.target.value)} />
        <input placeholder="Post title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea placeholder="Write your announcement..." value={content} onChange={e => setContent(e.target.value)} />
        <button className="btn-primary" style={{width:'100%'}} onClick={handlePublish} disabled={loading}>
          {loading ? 'Publishing...' : 'Publish On-Chain'}
        </button>
      </div>
    </div>
  );
}

function FeedPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  React.useEffect(() => {
    fetch('http://localhost:3001/posts')
      .then(r => r.json())
      .then(data => { setPosts(data); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <div className="page-logo">creda</div>
      </div>
      <div className="feed-header">
        <span className="feed-title">Verified Feed</span>
        <span className="post-count">{posts.length} posts</span>
      </div>
      {!loaded && <p style={{color:'#94a3b8', textAlign:'center'}}>Loading...</p>}
      {loaded && posts.length === 0 && <p style={{color:'#94a3b8', textAlign:'center'}}>No posts yet. Be the first!</p>}
      {posts.map((post, i) => (
        <div key={i} className="feed-card">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <div className="verified-badge">
            ✅ Verified Sui Wallet | {post.author?.slice(0,6)}...{post.author?.slice(-4)} | {new Date(post.timestamp).toLocaleString()}
          </div>
          <a className="verify-link" href={`/verify/${post.author}`}>🔍 Verify Wallet →</a>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/publish" element={<PublishPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/verify/:walletAddress" element={<VerifyPage />} />
      </Routes>
    </BrowserRouter>
  );
}