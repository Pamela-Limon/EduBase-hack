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

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const submissionData = {
        userId: userData.id,
        courseId: parseInt(values.courseId),
        title: values.title,
        content: values.content,
      };
      
      const response = await apiRequest('POST', '/api/submission', submissionData);
      const data = await response.json();
      
      // Start evaluation process
      await apiRequest('POST', `/api/submission/${data.id}/evaluate`);
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Trabajo enviado",
        description: "Tu trabajo ha sido enviado para evaluación por nuestro agente de IA.",
      });
      form.reset();
      setLocation("/certificaciones"); // Redirect to attestations page
    },
    onError: (error) => {
      toast({
        title: "Error al enviar trabajo",
        description: error.message || "Hubo un error al enviar tu trabajo. Por favor intenta de nuevo.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  const isLoading = isLoadingEnrollments || isLoadingCourses || mutation.isPending;

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
                        disabled={isLoading || enrolledCourses.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un curso" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {enrolledCourses.map((course: Course) => (
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

                <div className="flex items-center justify-end">
                  <Button 
                    type="submit" 
                    className="inline-flex items-center"
                    disabled={isLoading || enrolledCourses.length === 0}
                  >
                    {mutation.isPending ? (
                      <>
                        <span className="material-icons animate-spin mr-2 text-sm">sync</span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <span className="material-icons mr-2 text-sm">send</span>
                        Enviar para evaluación
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
