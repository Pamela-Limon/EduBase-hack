import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AttestationCard from "@/components/ui/attestation-card";
import { getUserAttestations } from "@/lib/attestations";
import { User, Enrollment, Attestation, Course, Submission } from "@shared/schema";
import { shortenAddress } from "@/lib/wallet";
import { formatAIFeedback } from "@/lib/ai-agent";

export default function StudentDetail() {
  const { id } = useParams();
  const userId = parseInt(id);

  // Fetch student details
  const { 
    data: student, 
    isLoading: isLoadingStudent,
    error: studentError
  } = useQuery<User>({
    queryKey: [`/api/user/${id}`],
  });

  // Fetch student's enrollments
  const { 
    data: enrollments = [], 
    isLoading: isLoadingEnrollments 
  } = useQuery<Enrollment[]>({
    queryKey: [`/api/enrollments/user/${id}`],
    enabled: !!userId && !isNaN(userId),
  });

  // Fetch student's attestations
  const { 
    data: attestations = [], 
    isLoading: isLoadingAttestations 
  } = useQuery<Attestation[]>({
    queryKey: [`/api/attestations/user/${id}`],
    enabled: !!userId && !isNaN(userId),
  });

  // Fetch courses for enrollment information
  const { 
    data: courses = [], 
    isLoading: isLoadingCourses 
  } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  // Fetch student's submissions
  const { 
    data: submissions = [], 
    isLoading: isLoadingSubmissions 
  } = useQuery<Submission[]>({
    queryKey: [`/api/submissions/user/${id}`],
    enabled: !!userId && !isNaN(userId),
  });

  const isLoading = isLoadingStudent || isLoadingEnrollments || isLoadingAttestations || 
                     isLoadingCourses || isLoadingSubmissions;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <span className="material-icons animate-spin text-primary-600 text-4xl">sync</span>
        <p className="mt-2 text-gray-600">Cargando datos del alumno...</p>
      </div>
    );
  }

  if (studentError || !student) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Alumno no encontrado</h2>
        <p className="text-gray-600 mb-6">No pudimos encontrar el alumno que estás buscando.</p>
        <Link href="/alumnos">
          <Button>Ver todos los alumnos</Button>
        </Link>
      </div>
    );
  }

  // Get course details for each enrollment
  const getCourseName = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Curso desconocido';
  };

  // Get initials from student name
  const initials = student.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/alumnos">
          <Button variant="link" className="pl-0 flex items-center text-gray-600">
            <span className="material-icons mr-1">arrow_back</span>
            Volver a alumnos
          </Button>
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 flex items-center">
          <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center mr-6">
            <span className="text-2xl font-medium text-primary-700">{initials}</span>
          </div>
          <div>
            <h3 className="text-2xl leading-6 font-medium text-gray-900 font-montserrat">{student.name}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{student.email}</p>
            <div className="mt-2 flex items-center">
              <span className="material-icons text-secondary-600 mr-1 text-sm">account_balance_wallet</span>
              <span className="text-sm text-gray-600">{shortenAddress(student.walletAddress)}</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="enrollments" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="enrollments">Cursos Inscritos</TabsTrigger>
          <TabsTrigger value="attestations">Certificaciones</TabsTrigger>
          <TabsTrigger value="submissions">Trabajos Enviados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enrollments">
          <h3 className="text-xl font-semibold text-gray-900 font-montserrat mb-4">Cursos Inscritos</h3>
          {enrollments.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600">Este alumno no está inscrito en ningún curso.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Curso</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha de Inscripción</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha de Finalización</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {getCourseName(enrollment.courseId)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          enrollment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          enrollment.status === 'active' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {enrollment.status === 'completed' ? 'Completado' : 
                           enrollment.status === 'active' ? 'En Progreso' : 
                           'Abandonado'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(enrollment.enrollmentDate).toLocaleDateString('es-ES')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {enrollment.completionDate ? new Date(enrollment.completionDate).toLocaleDateString('es-ES') : '-'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link href={`/cursos/${enrollment.courseId}`}>
                          <a className="text-primary-600 hover:text-primary-900">Ver curso</a>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="attestations">
          <h3 className="text-xl font-semibold text-gray-900 font-montserrat mb-4">Certificaciones</h3>
          {attestations.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600">Este alumno aún no tiene certificaciones.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {attestations.map(attestation => (
                <AttestationCard 
                  key={attestation.id} 
                  attestation={attestation} 
                  recipient={student.name}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="submissions">
          <h3 className="text-xl font-semibold text-gray-900 font-montserrat mb-4">Trabajos Enviados</h3>
          {submissions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600">Este alumno aún no ha enviado trabajos para evaluación.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {submissions.map(submission => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{submission.title}</CardTitle>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        submission.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        submission.status === 'evaluating' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {submission.status === 'completed' ? 'Evaluado' : 
                         submission.status === 'evaluating' ? 'Evaluando' : 
                         'Pendiente'}
                      </span>
                    </div>
                    <CardDescription>
                      Curso: {getCourseName(submission.courseId)} | 
                      Enviado: {new Date(submission.submissionDate).toLocaleDateString('es-ES')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {submission.status === 'completed' ? (
                      <div>
                        <div className="mb-4">
                          <span className="text-gray-700 font-medium">Puntuación: </span>
                          <span className={`font-semibold ${
                            (submission.score || 0) >= 70 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {submission.score}/100
                          </span>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <h4 className="text-gray-900 font-medium mb-2">Retroalimentación de la IA:</h4>
                          <div 
                            className="text-gray-700 bg-gray-50 p-4 rounded"
                            dangerouslySetInnerHTML={{ __html: formatAIFeedback(submission.feedback || '') }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-600">
                        {submission.status === 'evaluating' ? (
                          <div className="flex items-center">
                            <span className="material-icons animate-spin text-yellow-500 mr-2">sync</span>
                            Este trabajo está siendo evaluado por nuestro agente de IA.
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span className="material-icons text-gray-400 mr-2">hourglass_empty</span>
                            Este trabajo está en espera para ser evaluado.
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-gray-900 font-medium mb-2">Extracto del trabajo:</h4>
                      <p className="text-gray-700 italic">
                        "{submission.content.substring(0, 200)}..."
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
