import { 
  users, type User, type InsertUser,
  courses, type Course, type InsertCourse,
  enrollments, type Enrollment, type InsertEnrollment,
  attestations, type Attestation, type InsertAttestation,
  submissions, type Submission, type InsertSubmission
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Course operations
  getCourse(id: number): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Enrollment operations
  getEnrollment(id: number): Promise<Enrollment | undefined>;
  getEnrollmentsForUser(userId: number): Promise<Enrollment[]>;
  getEnrollmentsForCourse(courseId: number): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollmentStatus(id: number, status: string): Promise<Enrollment>;
  
  // Attestation operations
  getAttestation(id: number): Promise<Attestation | undefined>;
  getAttestationsForUser(userId: number): Promise<Attestation[]>;
  getAttestationsForCourse(courseId: number): Promise<Attestation[]>;
  getAllAttestations(): Promise<Attestation[]>;
  createAttestation(attestation: InsertAttestation): Promise<Attestation>;
  updateAttestationStatus(id: number, status: string, transactionId?: string): Promise<Attestation>;
  
  // Submission operations
  getSubmission(id: number): Promise<Submission | undefined>;
  getSubmissionsForUser(userId: number): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  updateSubmissionStatus(id: number, status: string): Promise<Submission>;
  updateSubmissionFeedback(id: number, feedback: string, score: number, evaluationData: any): Promise<Submission>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private enrollments: Map<number, Enrollment>;
  private attestations: Map<number, Attestation>;
  private submissions: Map<number, Submission>;
  private userId: number;
  private courseId: number;
  private enrollmentId: number;
  private attestationId: number;
  private submissionId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.enrollments = new Map();
    this.attestations = new Map();
    this.submissions = new Map();
    this.userId = 1;
    this.courseId = 1;
    this.enrollmentId = 1;
    this.attestationId = 1;
    this.submissionId = 1;
    
    // Initialize with some sample courses
    this.initializeSampleCourses();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.walletAddress === walletAddress);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Course operations
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.courseId++;
    const course: Course = { ...insertCourse, id, enrollments: 0, createdAt: new Date() };
    this.courses.set(id, course);
    return course;
  }

  // Enrollment operations
  async getEnrollment(id: number): Promise<Enrollment | undefined> {
    return this.enrollments.get(id);
  }

  async getEnrollmentsForUser(userId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(enrollment => enrollment.userId === userId);
  }

  async getEnrollmentsForCourse(courseId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(enrollment => enrollment.courseId === courseId);
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.enrollmentId++;
    const enrollment: Enrollment = { 
      ...insertEnrollment, 
      id, 
      enrollmentDate: new Date(),
      completionDate: null
    };
    this.enrollments.set(id, enrollment);
    
    // Update course enrollments count
    const course = await this.getCourse(insertEnrollment.courseId);
    if (course) {
      const updatedCourse = { ...course, enrollments: course.enrollments + 1 };
      this.courses.set(course.id, updatedCourse);
    }
    
    return enrollment;
  }

  async updateEnrollmentStatus(id: number, status: string): Promise<Enrollment> {
    const enrollment = this.enrollments.get(id);
    if (!enrollment) {
      throw new Error(`Enrollment with id ${id} not found`);
    }
    
    const updatedEnrollment: Enrollment = { 
      ...enrollment, 
      status,
      completionDate: status === "completed" ? new Date() : enrollment.completionDate
    };
    this.enrollments.set(id, updatedEnrollment);
    return updatedEnrollment;
  }

  // Attestation operations
  async getAttestation(id: number): Promise<Attestation | undefined> {
    return this.attestations.get(id);
  }

  async getAttestationsForUser(userId: number): Promise<Attestation[]> {
    return Array.from(this.attestations.values()).filter(attestation => attestation.userId === userId);
  }

  async getAttestationsForCourse(courseId: number): Promise<Attestation[]> {
    return Array.from(this.attestations.values()).filter(attestation => attestation.courseId === courseId);
  }

  async getAllAttestations(): Promise<Attestation[]> {
    return Array.from(this.attestations.values());
  }

  async createAttestation(insertAttestation: InsertAttestation): Promise<Attestation> {
    const id = this.attestationId++;
    const attestation: Attestation = { 
      ...insertAttestation, 
      id, 
      date: new Date()
    };
    this.attestations.set(id, attestation);
    return attestation;
  }

  async updateAttestationStatus(id: number, status: string, transactionId?: string): Promise<Attestation> {
    const attestation = this.attestations.get(id);
    if (!attestation) {
      throw new Error(`Attestation with id ${id} not found`);
    }
    
    const updatedAttestation: Attestation = { 
      ...attestation, 
      status,
      transactionId: transactionId || attestation.transactionId
    };
    this.attestations.set(id, updatedAttestation);
    return updatedAttestation;
  }

  // Submission operations
  async getSubmission(id: number): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  async getSubmissionsForUser(userId: number): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(submission => submission.userId === userId);
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = this.submissionId++;
    const submission: Submission = { 
      ...insertSubmission, 
      id, 
      submissionDate: new Date(),
      status: 'pending',
      feedback: null,
      score: null,
      evaluationData: null
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async updateSubmissionStatus(id: number, status: string): Promise<Submission> {
    const submission = this.submissions.get(id);
    if (!submission) {
      throw new Error(`Submission with id ${id} not found`);
    }
    
    const updatedSubmission: Submission = { 
      ...submission, 
      status
    };
    this.submissions.set(id, updatedSubmission);
    return updatedSubmission;
  }

  async updateSubmissionFeedback(id: number, feedback: string, score: number, evaluationData: any): Promise<Submission> {
    const submission = this.submissions.get(id);
    if (!submission) {
      throw new Error(`Submission with id ${id} not found`);
    }
    
    const updatedSubmission: Submission = { 
      ...submission, 
      feedback,
      score,
      evaluationData,
      status: 'completed'
    };
    this.submissions.set(id, updatedSubmission);
    return updatedSubmission;
  }

  // Helper method to initialize sample courses
  private initializeSampleCourses() {
    const sampleCourses: InsertCourse[] = [
      {
        title: 'Desarrollo Blockchain Avanzado',
        description: 'Aprende a desarrollar aplicaciones descentralizadas en Base y emitir attestations para certificar conocimientos.',
        category: 'Blockchain',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
        duration: '8 semanas',
        rating: '4.5'
      },
      {
        title: 'Redacción Científica Avanzada',
        description: 'Domina las técnicas de escritura científica y académica con evaluación por IA para mejorar tus publicaciones.',
        category: 'Investigación',
        imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
        duration: '6 semanas',
        rating: '4.0'
      },
      {
        title: 'IA en Blockchain',
        description: 'Explora la integración de IA con tecnologías blockchain para crear sistemas descentralizados inteligentes.',
        category: 'IA',
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
        duration: '10 semanas',
        rating: '4.9'
      }
    ];

    sampleCourses.forEach(course => {
      this.createCourse(course);
    });
  }
}

export const storage = new MemStorage();
