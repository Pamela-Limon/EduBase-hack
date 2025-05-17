import { useQuery } from "@tanstack/react-query";
import StudentCard from "@/components/ui/student-card";
import { useMobile } from "@/hooks/use-mobile";

export default function Students() {
  const isMobile = useMobile();
  
  // Fetch all users
  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ['/api/users'],
  });

  // Fetch all enrollments
  const { data: enrollments = [], isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ['/api/enrollments'],
  });

  // Fetch all attestations
  const { data: attestations = [], isLoading: isLoadingAttestations } = useQuery({
    queryKey: ['/api/attestations'],
  });

  const isLoading = isLoadingStudents || isLoadingEnrollments || isLoadingAttestations;

  // Group enrollments and attestations by user
  const getUserEnrollments = (userId: number) => 
    enrollments.filter(enrollment => enrollment.userId === userId);
  
  const getUserAttestations = (userId: number) => 
    attestations.filter(attestation => attestation.userId === userId);

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase font-montserrat">Comunidad de Alumnos</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-montserrat">
            Alumnos Destacados
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Conoce a algunos de nuestros alumnos y sus attestations obtenidas a través de nuestra plataforma.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <span className="material-icons animate-spin text-primary-600 text-4xl">sync</span>
            <p className="mt-2 text-gray-600">Cargando alumnos...</p>
          </div>
        ) : (
          <>
            {/* Desktop table view */}
            <div className="hidden sm:block -mx-4 sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle">
                <div className="shadow-md rounded-lg overflow-hidden border-b border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Alumno
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cursos Completados
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attestations
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Wallet ID
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Ver perfil</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <StudentCard 
                          key={student.id} 
                          student={student}
                          enrollments={getUserEnrollments(student.id)}
                          attestations={getUserAttestations(student.id)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mobile card view */}
            <div className="sm:hidden space-y-4">
              {students.map((student) => (
                <StudentCard 
                  key={student.id} 
                  student={student}
                  enrollments={getUserEnrollments(student.id)}
                  attestations={getUserAttestations(student.id)}
                  isMobile={true}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
