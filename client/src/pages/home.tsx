import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import CourseCard from "@/components/ui/course-card";
import StudentCard from "@/components/ui/student-card";
import AttestationCard from "@/components/ui/attestation-card";
import { useWallet } from "@/contexts/WalletContext";
import { ConnectWalletModal } from "@/components/ConnectWalletModal";
import { useState } from "react";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const { isConnected } = useWallet();

  // Fetch courses
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ['/api/courses'],
  });

  // Fetch attestations
  const { data: attestations = [], isLoading: isLoadingAttestations } = useQuery({
    queryKey: ['/api/attestations'],
  });

  return (
    <>
      <ConnectWalletModal open={modalOpen} onOpenChange={setModalOpen} />
      
      {/* Hero Section */}
      <div className="bg-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="hidden lg:block absolute right-0 inset-y-0 w-1/2 bg-gradient-to-r from-primary-50 to-primary-100 rounded-l-3xl"></div>
          <div className="relative lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="lg:pr-8">
              <div className="max-w-md mx-auto lg:max-w-lg lg:mx-0">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl font-montserrat">
                  Educación Descentralizada<br />
                  <span className="text-primary-600">en Blockchain</span>
                </h1>
                <p className="mt-4 text-lg text-gray-500">
                  Accede a cursos educativos y obtén certificaciones verificables en la blockchain de Base, evaluadas por nuestro agente de IA especializado.
                </p>
                <div className="mt-8 flex">
                  <div className="inline-flex rounded-md shadow">
                    <Link href="/cursos">
                      <Button className="inline-flex items-center justify-center px-5 py-3 text-base font-medium">
                        Explorar Cursos
                      </Button>
                    </Link>
                  </div>
                  <div className="ml-3 inline-flex">
                    <Button 
                      variant="secondary" 
                      className="inline-flex items-center justify-center px-5 py-3 text-base font-medium"
                    >
                      Cómo funciona
                    </Button>
                  </div>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary-500 text-white">
                      <span className="material-icons">verified</span>
                    </span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Certificaciones Verificables</h3>
                    <p className="mt-1 text-sm text-gray-500">Todas las certificaciones son emitidas como attestations en la blockchain de Base.</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary-500 text-white">
                      <span className="material-icons">smart_toy</span>
                    </span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Evaluación por IA</h3>
                    <p className="mt-1 text-sm text-gray-500">Nuestro agente de IA evalúa tus trabajos y acredita tus competencias de forma objetiva.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0">
              <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                <img className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none" src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" alt="Plataforma educativa descentralizada con blockchain" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase font-montserrat">Nuestros Cursos</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-montserrat">
              Formación Especializada
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Explora nuestros cursos y certifica tus conocimientos en la blockchain de forma transparente y verificable.
            </p>
          </div>

          <div className="mt-10">
            {isLoadingCourses ? (
              <div className="text-center">Cargando cursos...</div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {courses.slice(0, 3).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/cursos">
              <Button variant="outline" className="inline-flex items-center px-4 py-2 border border-primary-600 text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Ver todos los cursos
                <span className="material-icons ml-2 text-sm">arrow_forward</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Attestation Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase font-montserrat">Certificaciones Blockchain</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-montserrat">
              Attestations en Base
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Nuestras certificaciones se registran como attestations en la blockchain de Base, proporcionando una prueba verificable y permanente de tus logros.
            </p>
          </div>

          <div className="mt-10">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/2 pr-0 lg:pr-8 mb-6 lg:mb-0">
                    <img className="w-full rounded-lg shadow" src="https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500" alt="Certificación digital en blockchain" />
                  </div>
                  <div className="lg:w-1/2">
                    <h3 className="text-xl font-semibold text-gray-900 font-montserrat mb-4">¿Qué son las Attestations?</h3>
                    <p className="text-gray-600 mb-4">
                      Las attestations son declaraciones verificables almacenadas en la blockchain que certifican hechos específicos sobre una entidad o persona. En nuestra plataforma, utilizamos attestations en Base para:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex">
                        <span className="material-icons text-success-500 mr-2 flex-shrink-0">check_circle</span>
                        <span className="text-gray-600">Certificar la finalización de cursos educativos</span>
                      </li>
                      <li className="flex">
                        <span className="material-icons text-success-500 mr-2 flex-shrink-0">check_circle</span>
                        <span className="text-gray-600">Validar competencias específicas evaluadas por nuestro agente de IA</span>
                      </li>
                      <li className="flex">
                        <span className="material-icons text-success-500 mr-2 flex-shrink-0">check_circle</span>
                        <span className="text-gray-600">Crear credenciales verificables que pueden compartirse con empleadores</span>
                      </li>
                      <li className="flex">
                        <span className="material-icons text-success-500 mr-2 flex-shrink-0">check_circle</span>
                        <span className="text-gray-600">Establecer un historial permanente de logros educativos</span>
                      </li>
                    </ul>
                    <div className="mt-6">
                      <Link href="/certificaciones">
                        <Button className="inline-flex items-center">
                          Explorar Attestations
                          <span className="material-icons ml-2 text-sm">arrow_forward</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 font-montserrat mb-4">Ejemplos de Attestations Recientes</h3>
              <div className="grid grid-cols-1 gap-4">
                {isLoadingAttestations ? (
                  <div className="text-center">Cargando attestations...</div>
                ) : (
                  attestations.slice(0, 2).map((attestation) => (
                    <AttestationCard 
                      key={attestation.id} 
                      attestation={attestation} 
                      recipient="Laura Pérez"
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Agent Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase font-montserrat">Evaluación Inteligente</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-montserrat">
              Agente de IA para Evaluación
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Nuestro agente de IA analiza y evalúa tus trabajos de forma objetiva, proporcionando retroalimentación detallada y generando attestations basadas en el desempeño.
            </p>
          </div>

          <div className="mt-10">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div className="relative lg:order-2">
                <img className="relative mx-auto rounded-lg shadow-lg" src="https://images.unsplash.com/photo-1591696205602-2f950c417cb9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" alt="Agente de IA evaluando trabajo académico" />
              </div>
              <div className="mt-10 lg:mt-0 lg:order-1">
                <h3 className="text-xl font-semibold text-gray-900 font-montserrat mb-4">¿Cómo funciona nuestro Agente de IA?</h3>
                <div className="mt-6 space-y-8">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary-600 text-white">
                        <span className="material-icons">upload_file</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg leading-6 font-medium text-gray-900">1. Envía tu trabajo</h4>
                      <p className="mt-2 text-base text-gray-500">
                        Sube tu trabajo de redacción científica, código u otro contenido a través de nuestra plataforma educativa.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary-600 text-white">
                        <span className="material-icons">psychology</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg leading-6 font-medium text-gray-900">2. Análisis por IA</h4>
                      <p className="mt-2 text-base text-gray-500">
                        Nuestro agente de IA basado en LangChain.js y AgentKit analiza tu trabajo siguiendo criterios académicos y técnicos específicos.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary-600 text-white">
                        <span className="material-icons">reviews</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg leading-6 font-medium text-gray-900">3. Retroalimentación detallada</h4>
                      <p className="mt-2 text-base text-gray-500">
                        Recibe comentarios específicos sobre fortalezas, áreas de mejora y recomendaciones para optimizar tu trabajo.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary-600 text-white">
                        <span className="material-icons">verified</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg leading-6 font-medium text-gray-900">4. Generación de Attestation</h4>
                      <p className="mt-2 text-base text-gray-500">
                        Si tu trabajo cumple con los criterios, el agente genera automáticamente una attestation en Base que certifica tus habilidades.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            {isConnected ? (
              <Link href="/enviar-trabajo">
                <Button size="lg" className="inline-flex items-center px-6 py-3 text-base font-medium">
                  Probar el agente de IA
                  <span className="material-icons ml-2">arrow_forward</span>
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                className="inline-flex items-center px-6 py-3 text-base font-medium"
                onClick={() => setModalOpen(true)}
              >
                Conectar wallet para probar
                <span className="material-icons ml-2">arrow_forward</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
