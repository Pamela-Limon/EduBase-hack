import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { Wallet, Loader2 } from "lucide-react";

interface ConnectWalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectWalletModal({ open, onOpenChange }: ConnectWalletModalProps) {
  const { connect, isConnecting } = useWallet();

  const handleConnect = async () => {
    await connect();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
            <Wallet className="h-6 w-6 text-primary-600" />
          </div>
          <DialogTitle className="text-center mt-3 text-lg font-medium text-gray-900 font-montserrat">
            Conectar Smart Wallet
          </DialogTitle>
          <DialogDescription className="text-center mt-2 text-sm text-gray-500">
            Conecta tu Smart Wallet de Base para acceder a la plataforma educativa descentralizada y gestionar tus certificaciones.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-5 sm:mt-6 space-y-3">
          <Button 
            className="w-full justify-center"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            <span className="mr-2">Conectar con Base Wallet</span>
            {isConnecting && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-center"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            <span className="mr-2">Conectar con MetaMask</span>
            {isConnecting && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-center"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            <span className="mr-2">Wallet Connect</span>
            {isConnecting && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Exportar también como default para mantener compatibilidad
export default ConnectWalletModal;
