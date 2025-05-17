import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Usuarios
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Cursos
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  duration: text("duration").notNull(),
  rating: text("rating"),
  enrollments: integer("enrollments").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  enrollments: true,
  createdAt: true,
});

// Inscripciones a cursos
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  status: text("status").notNull().default("active"), // active, completed, dropped
  enrollmentDate: timestamp("enrollment_date").defaultNow().notNull(),
  completionDate: timestamp("completion_date"),
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrollmentDate: true,
  completionDate: true,
});

// Certificaciones (Attestations)
export const attestations = pgTable("attestations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  skills: text("skills").array(),
  transactionId: text("transaction_id"),
  date: timestamp("date").defaultNow().notNull(),
  status: text("status").notNull().default("pending"), // pending, issued, revoked
});

export const insertAttestationSchema = createInsertSchema(attestations).omit({
  id: true,
  date: true,
});

// Trabajos enviados para evaluación
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  submissionDate: timestamp("submission_date").defaultNow().notNull(),
  status: text("status").notNull().default("pending"), // pending, evaluating, completed
  feedback: text("feedback"),
  score: integer("score"),
  evaluationData: json("evaluation_data"),
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  submissionDate: true,
  status: true,
  feedback: true,
  score: true,
  evaluationData: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;

export type Attestation = typeof attestations.$inferSelect;
export type InsertAttestation = z.infer<typeof insertAttestationSchema>;

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
