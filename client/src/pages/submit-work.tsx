import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useWallet } from "@/contexts/WalletContext";
import { ConnectWalletModal } from "@/components/ConnectWalletModal";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Course, Enrollment } from "@shared/schema";
import { Brain, Check, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  courseId: z.string().min(1, "Selecciona un curso"),
  content: z.string().min(100, "El contenido debe tener al menos 100 caracteres"),
});

export default function SubmitWork() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<null | {
    isValid: boolean;
    feedback: string;
    score: number;
  }>(null);
  const [attestationEnabled, setAttestationEnabled] = useState(false);
  const [attestationInProgress, setAttestationInProgress] = useState(false);
  const { isConnected, userData } = useWallet();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  // Redirect if not connected
  if (!isConnected || !userData) {
    return (
      <>
        <ConnectWalletModal open={modalOpen} onOpenChange={setModalOpen} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 font-montserrat mb-4">
              Enviar trabajo para evaluación
            </h1>
            <p className="text-gray-600 mb-8">
              Necesitas conectar tu wallet para enviar trabajos para evaluación por nuestro agente de IA.
            </p>
            <Button 
              size="lg"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center"
            >
              <span className="material-icons mr-2">account_balance_wallet</span>
              Conectar Wallet
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Fetch user's enrolled courses
  const { data: enrollments = [], isLoading: isLoadingEnrollments } = useQuery<Enrollment[]>({
    queryKey: [`/api/enrollments/user/${userData.id}`],
  });

  // Fetch course details for all enrolled courses
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  // Filter courses that the user is enrolled in
  const enrolledCourses = courses.filter((course: Course) => 
    enrollments.some((enrollment: Enrollment) => 
      enrollment.courseId === course.id && enrollment.status === 'active'
    )
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      courseId: "",
      content: "",
    },
  });

  // Mutación para el análisis preliminar del documento con IA
  const analysisMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Llamamos a la API que analiza el documento con OpenAI
      const analysisData = {
        content: values.content,
        courseId: parseInt(values.courseId)
      };
      
      // Llamada real a la API para análisis con OpenAI
      const response = await apiRequest('POST', '/api/analyze-content', analysisData);
      return await response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      setAttestationEnabled(data.isValid && data.score >= 70);
      
      toast({
        title: data.isValid ? "Análisis completado con éxito" : "Documento requiere mejoras",
        description: data.feedback,
        variant: data.isValid ? "default" : "destructive",
      });
    },
    onError: (error) => {
      toast({
        title: "Error en el análisis",
        description: error.message || "Ocurrió un error al analizar tu documento. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    }
  });
  
  // Mutación para enviar el trabajo y generar la attestation
  const attestationMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Solo permitimos continuar si el análisis fue exitoso
      if (!attestationEnabled) {
        throw new Error('El documento no cumple con los criterios para certificación');
      }
      
      const submissionData = {
        userId: userData.id,
        courseId: parseInt(values.courseId),
        title: values.title,
        content: values.content,
      };
      
      // Crear la submission primero
      const response = await apiRequest('POST', '/api/submission', submissionData);
      const data = await response.json();
      
      // Iniciar proceso de evaluación y generación de attestation
      await apiRequest('POST', `/api/submission/${data.id}/evaluate`);
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Attestation generada con éxito",
        description: "Tu trabajo ha sido certificado en Base Sepolia. Puedes ver tu certificación en la sección de certificaciones.",
      });
      form.reset();
      setAnalysisResult(null);
      setAttestationEnabled(false);
      setLocation("/certificaciones"); // Redirect to attestations page
    },
    onError: (error) => {
      toast({
        title: "Error al generar attestation",
        description: error.message || "Ocurrió un error al certificar tu trabajo. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    }
  });

  // Función para analizar el documento con IA
  const analyzeDocument = (values: z.infer<typeof formSchema>) => {
    setIsAnalyzing(true);
    analysisMutation.mutate(values, {
      onSettled: () => setIsAnalyzing(false)
    });
  };
  
  // Función para generar la attestation en blockchain
  const generateAttestation = (values: z.infer<typeof formSchema>) => {
    setAttestationInProgress(true);
    attestationMutation.mutate(values, {
      onSettled: () => setAttestationInProgress(false)
    });
  };

  // Función para manejar el envío del formulario
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    analyzeDocument(values);
  };

  const isLoading = isLoadingEnrollments || isLoadingCourses || analysisMutation.isPending || attestationMutation.isPending;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 font-montserrat">
            Envía tu trabajo para evaluación por IA
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Nuestro agente de IA evaluará tu trabajo y, si cumple con los criterios, generará una attestation verificable en la blockchain.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Formulario de envío</CardTitle>
            <CardDescription>
              Completa el formulario con los detalles de tu trabajo para evaluación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título del trabajo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingresa un título descriptivo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="courseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Curso relacionado</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un curso" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courses.map((course: Course) => (
                            <SelectItem key={course.id} value={course.id.toString()}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contenido del trabajo</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Escribe o pega aquí el contenido de tu trabajo" 
                          className="min-h-[200px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Resultados del análisis, si hay alguno */}
                {analysisResult && (
                  <div className={`mt-4 p-4 rounded-lg border ${analysisResult.isValid ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 ${analysisResult.isValid ? 'text-green-500' : 'text-amber-500'}`}>
                        {analysisResult.isValid ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${analysisResult.isValid ? 'text-green-800' : 'text-amber-800'}`}>
                          Resultado del análisis (Puntuación: {analysisResult.score}/100)
                        </h3>
                        <div className={`mt-2 text-sm ${analysisResult.isValid ? 'text-green-700' : 'text-amber-700'}`}>
                          <p>{analysisResult.feedback}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-4 mt-6">
                  {/* Botón para analizar el documento */}
                  <Button 
                    type="button"
                    variant="outline"
                    className="inline-flex items-center"
                    disabled={false}
                    onClick={() => {
                      const values = form.getValues();
                      analyzeDocument(values);
                    }}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analizando...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Analizar con IA
                      </>
                    )}
                  </Button>
                  
                  {/* Botón para generar attestation en blockchain */}
                  <Button 
                    type="button" 
                    className="inline-flex items-center"
                    disabled={false}
                    onClick={() => {
                      const values = form.getValues();
                      generateAttestation(values);
                    }}
                  >
                    {attestationInProgress ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generando attestation en Base Sepolia...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Generar Certificación en Blockchain
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 font-montserrat mb-6">¿Cómo funciona la evaluación?</h2>
          <div className="space-y-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                  <span className="material-icons">upload_file</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">1. Envía tu trabajo</h3>
                <p className="mt-1 text-gray-600">
                  Completa el formulario con los detalles de tu trabajo y envíalo para evaluación.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                  <span className="material-icons">psychology</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">2. Evaluación por IA</h3>
                <p className="mt-1 text-gray-600">
                  Nuestro agente de IA analiza tu trabajo según los criterios del curso y genera una evaluación.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                  <span className="material-icons">feedback</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">3. Recibe retroalimentación</h3>
                <p className="mt-1 text-gray-600">
                  Recibirás comentarios detallados sobre tu trabajo y áreas de mejora.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                  <span className="material-icons">verified</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">4. Obtén tu attestation</h3>
                <p className="mt-1 text-gray-600">
                  Si tu trabajo cumple con los criterios, se generará una attestation verificable en la blockchain de Base.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
