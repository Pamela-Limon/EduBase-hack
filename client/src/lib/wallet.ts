// This is a wrapper around the onchainkit/wallet library to interact with Base
// Utility functions to connect, disconnect, and get wallet information

// We're using window.ethereum to connect to MetaMask or other Ethereum-compatible wallets
// In a production app, we'd use a proper library like onchainkit/wallet

export async function connectWallet(): Promise<string> {
  if (!window.ethereum) {
    throw new Error("No se encontró un proveedor de Ethereum. Por favor instala MetaMask u otro proveedor compatible.");
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    if (accounts && accounts.length > 0) {
      // Check if we're on Base Sepolia
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      // Base Sepolia Testnet: 0x14a34 (84532)
      const baseSepoliaChainId = '0x14a34'; 
      
      if (chainId !== baseSepoliaChainId) {
        // Try to switch to Base Sepolia
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: baseSepoliaChainId }],
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: baseSepoliaChainId,
                    chainName: 'Base Sepolia Testnet',
                    nativeCurrency: {
                      name: 'ETH',
                      symbol: 'ETH',
                      decimals: 18
                    },
                    rpcUrls: ['https://sepolia.base.org'],
                    blockExplorerUrls: ['https://sepolia.basescan.org']
                  }
                ],
              });
            } catch (addError) {
              throw new Error("No se pudo agregar la red Base Sepolia a tu wallet.");
            }
          } else {
            throw switchError;
          }
        }
      }
      
      return accounts[0];
    } else {
      throw new Error("No se pudo obtener acceso a las cuentas.");
    }
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
}

export async function disconnectWallet(): Promise<void> {
  // Note: There's no standard way to disconnect in Web3, we just clear our local state
  // The actual connection to the wallet remains, but our app will consider it disconnected
  localStorage.removeItem('walletConnected');
  return;
}

export async function getConnectedWallet(): Promise<string | null> {
  if (!window.ethereum) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts && accounts.length > 0) {
      return accounts[0];
    }
    return null;
  } catch (error) {
    console.error("Error getting connected wallet:", error);
    return null;
  }
}

export function shortenAddress(address: string): string {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Add a global type definition for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (params: any) => void) => void;
    };
  }
}
