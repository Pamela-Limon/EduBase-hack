import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { connectWallet, disconnectWallet, getConnectedWallet } from "@/lib/wallet";
import { apiRequest } from "@/lib/queryClient";

interface WalletContextType {
  walletAddress: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  userData: any | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const connectedWallet = await getConnectedWallet();
        if (connectedWallet) {
          setWalletAddress(connectedWallet);
          try {
            const response = await apiRequest("POST", `/api/user/wallet/${connectedWallet}`);
            const userData = await response.json();
            setUserData(userData);
          } catch (error) {
            console.log("Usuario no encontrado para esta wallet");
          }
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkWalletConnection();
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      
      try {
        const response = await apiRequest("POST", `/api/user/wallet/${address}`);
        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        console.log("Usuario no encontrado para esta wallet");
      }
      
      console.log("Wallet conectada exitosamente");
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    disconnectWallet();
    setWalletAddress(null);
    setUserData(null);
    console.log("Wallet desconectada exitosamente");
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        isConnecting,
        isConnected: !!walletAddress,
        connect,
        disconnect,
        userData,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    console.error("useWallet debe ser usado dentro de un WalletProvider");
    // Retornar un contexto por defecto en lugar de lanzar error
    return {
      walletAddress: null,
      isConnecting: false,
      isConnected: false,
      connect: async () => { console.error("WalletProvider no inicializado"); },
      disconnect: () => { console.error("WalletProvider no inicializado"); },
      userData: null
    };
  }
  return context;
}
