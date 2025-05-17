import { Attestation } from "@shared/schema";
import { shortenAddress } from "@/lib/wallet";

interface AttestationCardProps {
  attestation: Attestation;
  recipient?: string;
}

export default function AttestationCard({ attestation, recipient }: AttestationCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
            <span className="material-icons">verified</span>
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">{attestation.title}</h4>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {new Date(attestation.date).toLocaleDateString('es-ES')}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {recipient ? `Otorgada a: ${recipient}` : ''}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {attestation.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {attestation.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <span className="material-icons text-secondary-600 mr-1 text-sm">account_balance_wallet</span>
                <span>
                  {attestation.transactionId ? shortenAddress(attestation.transactionId) : 'Pendiente'}
                </span>
              </div>
              {attestation.transactionId && (
                <a 
                  href={`https://basescan.org/tx/${attestation.transactionId}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800"
                >
                  Verificar en Base
                  <span className="material-icons ml-1 text-sm">open_in_new</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
