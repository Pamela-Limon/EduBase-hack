import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { ConnectWalletModal } from "@/components/ConnectWalletModal";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CourseDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const { isConnected, userData } = useWallet();
  const [modalOpen, setModalOpen] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Fetch course details
  const { 
    data: course, 
    isLoading: isLoadingCourse,
    error
  } = useQuery({
    queryKey: [`/api/course/${id}`],
  });

  // Check if user is already enrolled
  const { data: userEnrollments = [], isLoading: isLoadingEnrollments } = useQuery({
    queryKey: [`/api/enrollments/user/${userData?.id}`],
    enabled: !!userData,
  });

  const isEnrolled = userEnrollments.some(enrollment => 
    enrollment.courseId === parseInt(id) && enrollment.status !== 'dropped'
  );

  const handleEnroll = async () => {
    if (!isConnected || !userData) {
      setModalOpen(true);
      return;
    }

    try {
      setIsEnrolling(true);
      const enrollment = {
        userId: userData.id,
        courseId: parseInt(id),
        status: 'active'
      };

      await apiRequest('POST', '/api/enrollment', enrollment);
      
      toast({
        title: "¡Inscripción exitosa!",
        description: "Te has inscrito en el curso correctamente.",
      });
      
      // Refresh enrollments data
      await queryClient.invalidateQueries({ queryKey: [`/api/enrollments/user/${userData?.id}`] });
    } catch (error) {
      toast({
        title: "Error al inscribirse",
        description: "No se pudo completar la inscripción. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoadingCourse) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <span className="material-icons animate-spin text-primary-600 text-4xl">sync</span>
        <p className="mt-2 text-gray-600">Cargando detalles del curso...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Curso no encontrado</h2>
        <p className="text-gray-600 mb-6">No pudimos encontrar el curso que estás buscando.</p>
        <Link href="/cursos">
          <Button>Ver todos los cursos</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <ConnectWalletModal open={modalOpen} onOpenChange={setModalOpen} />
      
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div>
              <img 
                src={course.imageUrl} 
                alt={course.title} 
                className="w-full rounded-lg shadow-lg object-cover h-64 lg:h-96"
              />
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  course.category === 'Blockchain' ? 'bg-secondary-100 text-secondary-800' : 
                  course.category === 'Investigación' ? 'bg-green-100 text-green-800' : 
                  'bg-purple-100 text-purple-800'
                }`}>
                  {course.category}
                </span>
                <div className="flex items-center">
                  {Array.from({ length: Math.floor(parseFloat(course.rating)) }).map((_, i) => (
                    <span key={i} className="material-icons text-yellow-500">star</span>
                  ))}
                  {parseFloat(course.rating) % 1 !== 0 && (
                    <span className="material-icons text-yellow-500">star_half</span>
                  )}
                  <span className="ml-1 text-sm text-gray-600">{course.rating}</span>
                </div>
              </div>
              <h1 className="mt-4 text-3xl font-extrabold text-gray-900 font-montserrat">{course.title}</h1>
              <div className="mt-2 flex items-center">
                <span className="material-icons text-gray-500 text-sm">schedule</span>
                <span className="ml-1 text-sm text-gray-500">{course.duration}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-500">{course.enrollments} estudiantes inscritos</span>
              </div>
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 font-montserrat">Descripción del curso</h3>
                <p className="mt-3 text-gray-700">{course.description}</p>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 font-montserrat">Lo que aprenderás</h3>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <li className="flex items-start">
                    <span className="material-icons text-success-500 mr-2 flex-shrink-0">check_circle</span>
                    <span className="text-gray-700">Conceptos fundamentales de blockchain</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-success-500 mr-2 flex-shrink-0">check_circle</span>
                    <span className="text-gray-700">Desarrollo en Base blockchain</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-success-500 mr-2 flex-shrink-0">check_circle</span>
                    <span className="text-gray-700">Creación de attestations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-success-500 mr-2 flex-shrink-0">check_circle</span>
                    <span className="text-gray-700">Integración con IA</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 flex">
                {isEnrolled ? (
                  <div className="w-full">
                    <div className="bg-green-100 text-green-800 px-4 py-3 rounded-md mb-4 flex items-center">
                      <span className="material-icons mr-2">check_circle</span>
                      <span>Ya estás inscrito en este curso</span>
                    </div>
                    <div className="flex gap-4">
                      <Button className="flex-1">
                        <span className="material-icons mr-2">play_circle</span>
                        Ir al curso
                      </Button>
                      <Link href="/enviar-trabajo">
                        <Button variant="outline" className="flex-1">
                          <span className="material-icons mr-2">assignment</span>
                          Enviar trabajo
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Button 
                    className="w-full py-3 text-lg" 
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                  >
                    {isEnrolling ? (
                      <>
                        <span className="material-icons animate-spin mr-2">sync</span>
                        Inscribiendo...
                      </>
                    ) : (
                      <>
                        <span className="material-icons mr-2">school</span>
                        Inscribirse al curso
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 font-montserrat mb-6">Certificación</h2>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary-500 text-white">
                    <span className="material-icons">verified</span>
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Certificación verificable en blockchain</h3>
                  <p className="mt-1 text-gray-600">
                    Al completar este curso y aprobar la evaluación por nuestro agente de IA, obtendrás una attestation verificable en la blockchain de Base.
                  </p>
                  <div className="mt-4">
                    <Link href="/certificaciones">
                      <Button variant="outline" className="inline-flex items-center">
                        Ver ejemplos de certificaciones
                        <span className="material-icons ml-2 text-sm">arrow_forward</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
