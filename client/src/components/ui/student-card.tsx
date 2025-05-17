import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { User, Enrollment, Attestation } from "@shared/schema";
import { shortenAddress } from "@/lib/wallet";

interface StudentCardProps {
  student: User;
  enrollments?: Enrollment[];
  attestations?: Attestation[];
  isMobile?: boolean;
}

export default function StudentCard({ 
  student, 
  enrollments = [], 
  attestations = [],
  isMobile = false 
}: StudentCardProps) {
  // Get initials from name
  const initials = student.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  // For mobile display
  if (isMobile) {
    return (
      <Card className="bg-white shadow overflow-hidden rounded-md">
        <div className="px-4 py-5 sm:px-6 flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="font-medium text-primary-700">{initials}</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">{student.name}</h3>
            <p className="text-sm text-gray-500">{student.email}</p>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Cursos Completados</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                {enrollments.filter(e => e.status === 'completed').length} cursos
              </dd>
            </div>
            <div className="bg-white px-4 py-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Attestations</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="material-icons text-xs mr-1">verified</span>
                  {attestations.length} attestations
                </span>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Wallet ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                {shortenAddress(student.walletAddress)}
              </dd>
            </div>
            <div className="bg-white px-4 py-3 flex justify-end">
              <Link href={`/alumnos/${student.id}`}>
                <a className="text-primary-600 hover:text-primary-900 text-sm font-medium">Ver perfil →</a>
              </Link>
            </div>
          </dl>
        </div>
      </Card>
    );
  }
  
  // For table row display (desktop)
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="font-medium text-primary-700">{initials}</span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{student.name}</div>
            <div className="text-sm text-gray-500">{student.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{enrollments.filter(e => e.status === 'completed').length} cursos</div>
        <div className="text-sm text-gray-500">
          {enrollments.length > 0 
            ? `Último: ${enrollments[0].status === 'completed' ? 'Completado' : 'En progreso'}`
            : 'Sin cursos'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <span className="material-icons text-xs mr-1">verified</span>
          {attestations.length} attestations
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {shortenAddress(student.walletAddress)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link href={`/alumnos/${student.id}`}>
          <a className="text-primary-600 hover:text-primary-900">Ver perfil</a>
        </Link>
      </td>
    </tr>
  );
}
