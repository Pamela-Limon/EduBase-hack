import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { connectWallet, disconnectWallet, getConnectedWallet } from "@/lib/wallet";

// Definición del tipo de contexto
interface WalletContextType {
  walletAddress: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  userData: any | null;
}

// Creación del contexto con un valor predeterminado
const defaultContext: WalletContextType = {
  walletAddress: null,
  isConnecting: false,
  isConnected: false,
  connect: async () => { console.error("WalletProvider no inicializado"); },
  disconnect: () => { console.error("WalletProvider no inicializado"); },
  userData: null
};

// Creación del contexto
const WalletContext = createContext<WalletContextType>(defaultContext);

// Hook para usar el contexto
export function useWallet() {
  return useContext(WalletContext);
}

// Proveedor del contexto
export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userData, setUserData] = useState<any | null>(null);

  // Comprobar si hay una conexión existente al cargar
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const address = await getConnectedWallet();
        if (address) {
          setWalletAddress(address);
          // Simular datos de usuario para pruebas
          setUserData({
            id: 1,
            username: "usuario_prueba",
            walletAddress: address,
            role: "student"
          });
        }
      } catch (error) {
        console.error("Error al verificar conexión de wallet:", error);
      }
    };

    checkConnection();
  }, []);

  // Función para conectar wallet
  const connect = async () => {
    setIsConnecting(true);
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      
      // Simular datos de usuario para pruebas
      setUserData({
        id: 1,
        username: "usuario_prueba",
        walletAddress: address,
        role: "student"
      });
      
      console.log("Wallet conectada exitosamente:", address);
    } catch (error) {
      console.error("Error al conectar wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Función para desconectar wallet
  const disconnect = () => {
    disconnectWallet();
    setWalletAddress(null);
    setUserData(null);
    console.log("Wallet desconectada exitosamente");
  };

  // Proveer el contexto
  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        isConnecting,
        isConnected: !!walletAddress,
        connect,
        disconnect,
        userData
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
