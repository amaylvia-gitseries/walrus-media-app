const TATUM_API_KEY = process.env.REACT_APP_TATUM_API_KEY;
const BASE_URL = 'https://api.tatum.io/v4';

async function getSuiBalance(walletAddress) {
  const response = await fetch(
    `${BASE_URL}/blockchain/sui/account/balance/${walletAddress}`,
    { headers: { 'x-api-key': TATUM_API_KEY } }
  );
  return response.json();
}

export async function verifyWallet(walletAddress) {
  const balance = await getSuiBalance(walletAddress);
  return {
    address: walletAddress,
    verified: true,
    balance: balance?.totalBalance || '0',
    network: 'Sui Mainnet'
  };
}

export async function getWalletHistory(walletAddress) {
  try {
    const response = await fetch(
      `https://sui-mainnet.gateway.tatum.io`,
      {
        method: 'POST',
        headers: {
          'x-api-key': TATUM_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'suix_getTransactionBlocks',
          params: [
            { filter: { FromAddress: walletAddress } },
            { limit: 10 }
          ]
        })
      }
    );
    const data = await response.json();
    return { data: data.result || [] };
  } catch (e) {
    return { data: [] };
  }
}