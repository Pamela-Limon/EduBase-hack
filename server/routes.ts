import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCourseSchema, insertEnrollmentSchema, insertAttestationSchema, insertSubmissionSchema } from "@shared/schema";
import { evaluateSubmission } from "./lib/langchain";
import { createAttestation } from "./lib/agentkit";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const api = '/api';

  // User routes
  app.get(`${api}/user/:id`, async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
  });

  app.post(`${api}/user/wallet/:address`, async (req, res) => {
    try {
      const user = await storage.getUserByWalletAddress(req.params.address);
      if (user) {
        return res.json(user);
      }
      return res.status(404).json({ message: 'Usuario no encontrado' });
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener usuario por wallet', error: error.message });
    }
  });

  app.post(`${api}/user`, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ message: 'Error al crear usuario', error: error.message });
    }
  });

  // Course routes
  app.get(`${api}/courses`, async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      return res.json(courses);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener cursos', error: error.message });
    }
  });

  app.get(`${api}/course/:id`, async (req, res) => {
    try {
      const course = await storage.getCourse(parseInt(req.params.id));
      if (!course) {
        return res.status(404).json({ message: 'Curso no encontrado' });
      }
      return res.json(course);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener curso', error: error.message });
    }
  });

  app.post(`${api}/course`, async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      return res.status(201).json(course);
    } catch (error) {
      return res.status(400).json({ message: 'Error al crear curso', error: error.message });
    }
  });

  // Enrollment routes
  app.get(`${api}/enrollments/user/:userId`, async (req, res) => {
    try {
      const enrollments = await storage.getEnrollmentsForUser(parseInt(req.params.userId));
      return res.json(enrollments);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener inscripciones', error: error.message });
    }
  });

  app.post(`${api}/enrollment`, async (req, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse(req.body);
      const enrollment = await storage.createEnrollment(enrollmentData);
      return res.status(201).json(enrollment);
    } catch (error) {
      return res.status(400).json({ message: 'Error al crear inscripción', error: error.message });
    }
  });

  app.put(`${api}/enrollment/:id/status`, async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: 'Status es requerido' });
      }
      const enrollment = await storage.updateEnrollmentStatus(parseInt(req.params.id), status);
      return res.json(enrollment);
    } catch (error) {
      return res.status(500).json({ message: 'Error al actualizar estado de inscripción', error: error.message });
    }
  });

  // Attestation routes
  app.get(`${api}/attestations`, async (req, res) => {
    try {
      const attestations = await storage.getAllAttestations();
      return res.json(attestations);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener certificaciones', error: error.message });
    }
  });

  app.get(`${api}/attestations/user/:userId`, async (req, res) => {
    try {
      const attestations = await storage.getAttestationsForUser(parseInt(req.params.userId));
      return res.json(attestations);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener certificaciones del usuario', error: error.message });
    }
  });

  app.post(`${api}/attestation`, async (req, res) => {
    try {
      const attestationData = insertAttestationSchema.parse(req.body);
      const attestation = await storage.createAttestation(attestationData);
      return res.status(201).json(attestation);
    } catch (error) {
      return res.status(400).json({ message: 'Error al crear certificación', error: error.message });
    }
  });

  app.post(`${api}/attestation/:id/issue`, async (req, res) => {
    try {
      const attestation = await storage.getAttestation(parseInt(req.params.id));
      if (!attestation) {
        return res.status(404).json({ message: 'Certificación no encontrada' });
      }

      // Create attestation on Base blockchain
      const transactionId = await createAttestation({
        recipient: req.body.walletAddress,
        attestationId: attestation.id,
        title: attestation.title,
        courseId: attestation.courseId,
        skills: attestation.skills
      });

      // Update attestation status
      const updatedAttestation = await storage.updateAttestationStatus(
        attestation.id, 
        'issued', 
        transactionId
      );
      
      return res.json(updatedAttestation);
    } catch (error) {
      return res.status(500).json({ message: 'Error al emitir certificación', error: error.message });
    }
  });

  // Submission routes
  app.post(`${api}/submission`, async (req, res) => {
    try {
      const submissionData = insertSubmissionSchema.parse(req.body);
      const submission = await storage.createSubmission(submissionData);
      return res.status(201).json(submission);
    } catch (error) {
      return res.status(400).json({ message: 'Error al crear envío', error: error.message });
    }
  });

  app.get(`${api}/submissions/user/:userId`, async (req, res) => {
    try {
      const submissions = await storage.getSubmissionsForUser(parseInt(req.params.userId));
      return res.json(submissions);
    } catch (error) {
      return res.status(500).json({ message: 'Error al obtener envíos del usuario', error: error.message });
    }
  });

  app.post(`${api}/submission/:id/evaluate`, async (req, res) => {
    try {
      const submission = await storage.getSubmission(parseInt(req.params.id));
      if (!submission) {
        return res.status(404).json({ message: 'Envío no encontrado' });
      }

      // Update submission status to evaluating
      await storage.updateSubmissionStatus(submission.id, 'evaluating');

      // Get associated course
      const course = await storage.getCourse(submission.courseId);
      if (!course) {
        return res.status(404).json({ message: 'Curso asociado no encontrado' });
      }

      // Evaluate submission with AI
      const evaluation = await evaluateSubmission(submission.content, course.title, course.category);

      // Update submission with feedback
      const updatedSubmission = await storage.updateSubmissionFeedback(
        submission.id,
        evaluation.feedback,
        evaluation.score,
        evaluation.details
      );

      // If score is high enough, create an attestation
      if (evaluation.score >= 70) {
        const skills = evaluation.skills || [];
        await storage.createAttestation({
          userId: submission.userId,
          courseId: submission.courseId,
          title: `Certificación en ${course.title}`,
          description: `Ha completado exitosamente el curso de ${course.title} con una evaluación por parte del agente de IA.`,
          skills,
          status: 'pending',
          transactionId: null
        });
      }

      return res.json(updatedSubmission);
    } catch (error) {
      return res.status(500).json({ message: 'Error al evaluar envío', error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
