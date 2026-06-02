const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const posts = [];

const WALRUS_PUBLISHER = "https://publisher.walrus-testnet.walrus.space";
const WALRUS_AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space";

app.put('/publish', async (req, res) => {
  try {
    const response = await fetch(`${WALRUS_PUBLISHER}/v1/blobs`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: Buffer.from(JSON.stringify(req.body))
    });
    const data = await response.json();
    res.json(data);
    posts.push({
  ...req.body,
  blobId: data.newlyCreated?.blobObject?.blobId || data.alreadyCertified?.blobId,
  timestamp: new Date().toISOString(),
  author: req.body.walletAddress,
  verified: true
});
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/get/:blobId', async (req, res) => {
  try {
    const response = await fetch(`${WALRUS_AGGREGATOR}/v1/blobs/${req.params.blobId}`);
    const text = await response.text();
    res.send(text);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/posts', (req, res) => {
  res.json(posts);
});

app.get('/posts/:walletAddress', (req, res) => {
  const walletPosts = posts.filter(p => p.author === req.params.walletAddress);
  res.json(walletPosts);
});

app.listen(3001, () => console.log('Server running on port 3001'));