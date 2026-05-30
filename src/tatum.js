const TATUM_API_KEY = "https://sui-mainnet.gateway.tatum.io";
const SUI_RPC = "https://sui-mainnet.gateway.tatum.io";

export async function getSuiBalance(walletAddress) {
  const response = await fetch(`${SUI_RPC}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': TATUM_API_KEY
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'suix_getBalance',
      params: [walletAddress, '0x2::sui::SUI']
    })
  });
  const data = await response.json();
  return data.result;
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