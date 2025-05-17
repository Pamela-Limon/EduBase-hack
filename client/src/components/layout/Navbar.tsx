import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useWallet } from "@/contexts/WalletContext";
import ConnectWalletModal from "@/components/ConnectWalletModal";
import { shortenAddress } from "@/lib/wallet";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { walletAddress, isConnected, disconnect } = useWallet();
  const [location] = useLocation();

  return (
    <>
      <ConnectWalletModal open={modalOpen} onOpenChange={setModalOpen} />
      
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-10 w-10 rounded-md bg-primary-600 flex items-center justify-center text-white font-bold text-lg">
                  EB
                </div>
                <span className="ml-2 text-xl font-montserrat font-semibold text-gray-900">EduBase</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/" 
                  className={`${location === '/' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Inicio
                </Link>
                <Link href="/cursos"
                  className={`${location === '/cursos' || location.startsWith('/cursos/') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Cursos
                </Link>
                <Link href="/alumnos"
                  className={`${location === '/alumnos' || location.startsWith('/alumnos/') ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Alumnos
                </Link>
                <Link href="/certificaciones"
                  className={`${location === '/certificaciones' ? 'border-primary-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Certificaciones
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {isConnected ? (
                <Button
                  variant="outline"
                  className="flex items-center px-3 py-2"
                  onClick={disconnect}
                >
                  <span className="material-icons text-success-500 mr-1 text-sm">check_circle</span>
                  {shortenAddress(walletAddress!)}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex items-center px-3 py-2"
                  onClick={() => setModalOpen(true)}
                >
                  <span className="material-icons text-gray-400 mr-1 text-sm">account_balance_wallet</span>
                  Conectar Wallet
                </Button>
              )}

              <div className="ml-3 relative">
                <div>
                  <button type="button" className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <span className="sr-only">Ver notificaciones</span>
                    <span className="material-icons">notifications</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="sr-only">Abrir menú principal</span>
                <span className="material-icons">{isOpen ? 'close' : 'menu'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`sm:hidden ${isOpen ? '' : 'hidden'}`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/"
              className={`${location === '/' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Inicio
            </Link>
            <Link href="/cursos"
              className={`${location === '/cursos' || location.startsWith('/cursos/') ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Cursos
            </Link>
            <Link href="/alumnos"
              className={`${location === '/alumnos' || location.startsWith('/alumnos/') ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Alumnos
            </Link>
            <Link href="/certificaciones"
              className={`${location === '/certificaciones' ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Certificaciones
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                {isConnected ? (
                  <Button
                    variant="outline"
                    className="flex items-center px-3 py-2"
                    onClick={disconnect}
                  >
                    <span className="material-icons text-success-500 mr-1 text-sm">check_circle</span>
                    {shortenAddress(walletAddress!)}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="flex items-center px-3 py-2"
                    onClick={() => setModalOpen(true)}
                  >
                    <span className="material-icons text-gray-400 mr-1 text-sm">account_balance_wallet</span>
                    Conectar Wallet
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
