export async function publishPost(title, content, walletAddress) {
  const post = {
    title,
    content,
    author: walletAddress,
    timestamp: new Date().toISOString(),
    platform: "WalrusMedia"
  };

  const response = await fetch('http://localhost:3001/publish', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  });

  const data = await response.json();
  const blobId = data.newlyCreated?.blobObject?.blobId || 
                 data.alreadyCertified?.blobId;
  return { blobId, post };
}

export async function getPost(blobId) {
  const response = await fetch(`http://localhost:3001/get/${blobId}`);
  const text = await response.text();
  return JSON.parse(text);
}