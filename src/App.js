import React, { useState } from 'react';
import { publishPost, getPost } from './walrus';
import './App.css';

function App() {
  const [wallet, setWallet] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (!wallet || !title || !content) {
      alert('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const { blobId, post } = await publishPost(title, content, wallet);
      setPosts([{ ...post, blobId }, ...posts]);
      setTitle('');
      setContent('');
      alert('Published! Blob ID: ' + blobId);
    } catch (err) {
      alert('Error publishing: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>🌊 Walrus Media</h1>
      <p>Verified on-chain publishing for memecoin projects</p>

      <div className="publish-form">
        <input placeholder="Your wallet address" value={wallet} onChange={e => setWallet(e.target.value)} />
        <input placeholder="Post title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea placeholder="Write your announcement..." value={content} onChange={e => setContent(e.target.value)} />
        <button onClick={handlePublish} disabled={loading}>
          {loading ? 'Publishing...' : 'Publish On-Chain'}
        </button>
      </div>

      <div className="feed">
        <h2>📢 Verified Feed</h2>
        {posts.length === 0 && <p>No posts yet. Be the first to publish!</p>}
        {posts.map((post, i) => (
          <div key={i} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <small>✓ Verified On-Chain | {post.author} | {new Date(post.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;