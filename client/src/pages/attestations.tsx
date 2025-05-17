import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import AttestationCard from "@/components/ui/attestation-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/contexts/WalletContext";
import { ConnectWalletModal } from "@/components/ConnectWalletModal";

export default function Attestations() {
  const [modalOpen, setModalOpen] = useState(false);
  const { isConnected, userData } = useWallet();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all attestations
  const { data: attestations = [], isLoading } = useQuery({
    queryKey: ['/api/attestations'],
  });

  // Fetch users for recipient names
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['/api/users'],
  });

  // Get recipient name from user ID
  const getRecipientName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : "Usuario desconocido";
  };

  // Filter attestations by search term
  const filteredAttestations = attestations.filter(attestation => {
    const recipientName = getRecipientName(attestation.userId);
    const searchString = `${attestation.title} ${attestation.description} ${recipientName}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  // Get user's attestations if logged in
  const userAttestations = userData ? attestations.filter(a => a.userId === userData.id) : [];

  return (
    <>
      <ConnectWalletModal open={modalOpen} onOpenChange={setModalOpen} />
      
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase font-montserrat">Certificaciones Blockchain</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-montserrat">
              Attestations en Base
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Explora las certificaciones emitidas como attestations en la blockchain de Base.
            </p>
          </div>

          {isConnected && userData && (
            <div className="mt-10 bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Tus Certificaciones</h3>
                {userAttestations.length === 0 ? (
                  <div className="mt-4 text-gray-500">
                    <p>Aún no tienes certificaciones. Completa un curso para obtener tu primera attestation.</p>
                    <div className="mt-4">
                      <Button className="inline-flex items-center">
                        Explorar Cursos
                        <span className="material-icons ml-2 text-sm">arrow_forward</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-1 gap-4">
                    {userAttestations.map(attestation => (
                      <AttestationCard 
                        key={attestation.id} 
                        attestation={attestation} 
                        recipient={userData.name}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-10">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 font-montserrat">Todas las Attestations</h3>
              <div className="w-full md:w-auto">
                <Input
                  type="text"
                  placeholder="Buscar attestations..."
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading || isLoadingUsers ? (
              <div className="text-center py-10">
                <span className="material-icons animate-spin text-primary-600 text-4xl">sync</span>
                <p className="mt-2 text-gray-600">Cargando attestations...</p>
              </div>
            ) : filteredAttestations.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-600">No se encontraron certificaciones que coincidan con tu búsqueda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredAttestations.map(attestation => (
                  <AttestationCard 
                    key={attestation.id} 
                    attestation={attestation} 
                    recipient={getRecipientName(attestation.userId)}
                  />
                ))}
              </div>
            )}
          </div>

          {!isConnected && (
            <div className="mt-12 bg-white p-6 rounded-lg shadow-sm text-center">
              <h3 className="text-lg font-medium text-gray-900">¿Quieres ver tus propias attestations?</h3>
              <p className="mt-2 text-gray-600">Conéctate con tu wallet para ver y gestionar tus certificaciones en blockchain.</p>
              <div className="mt-4">
                <Button 
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center"
                >
                  <span className="material-icons mr-2 text-sm">account_balance_wallet</span>
                  Conectar Wallet
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
