/**
 * Client-side utilities for interacting with the AI agent that evaluates student work
 */
import { apiRequest } from "./queryClient";
import { Submission } from "@shared/schema";

/**
 * Submit a text for evaluation by the AI agent
 * 
 * @param userId The user ID 
 * @param courseId The course ID
 * @param title The submission title
 * @param content The content to evaluate
 * @returns The created submission object
 */
export async function submitWorkForEvaluation(
  userId: number,
  courseId: number,
  title: string,
  content: string
): Promise<Submission> {
  try {
    // First create the submission
    const submissionResponse = await apiRequest(
      'POST',
      '/api/submission',
      { userId, courseId, title, content }
    );
    
    const submission: Submission = await submissionResponse.json();
    
    // Then start the evaluation process
    await apiRequest(
      'POST',
      `/api/submission/${submission.id}/evaluate`
    );
    
    return submission;
  } catch (error) {
    console.error('Error submitting work for evaluation:', error);
    throw new Error('No se pudo enviar el trabajo para evaluación');
  }
}

/**
 * Get the status of a submission
 * 
 * @param submissionId The submission ID
 * @returns The submission object with its current status
 */
export async function getSubmissionStatus(submissionId: number): Promise<Submission> {
  try {
    const response = await apiRequest(
      'GET',
      `/api/submission/${submissionId}`
    );
    
    return await response.json();
  } catch (error) {
    console.error('Error getting submission status:', error);
    throw new Error('No se pudo obtener el estado de la evaluación');
  }
}

/**
 * Get all submissions for a user
 * 
 * @param userId The user ID
 * @returns Array of submissions with their current status
 */
export async function getUserSubmissions(userId: number): Promise<Submission[]> {
  try {
    const response = await apiRequest(
      'GET', 
      `/api/submissions/user/${userId}`
    );
    
    return await response.json();
  } catch (error) {
    console.error('Error getting user submissions:', error);
    throw new Error('No se pudo obtener los trabajos enviados');
  }
}

/**
 * Format AI feedback for display
 * 
 * @param feedback Raw feedback from the AI
 * @returns Formatted feedback with highlights
 */
export function formatAIFeedback(feedback: string): string {
  if (!feedback) return '';
  
  // Replace sections with styled sections
  return feedback
    .replace(/Fortalezas:/g, '<strong class="text-success-500">Fortalezas:</strong>')
    .replace(/Áreas de mejora:/g, '<strong class="text-primary-600">Áreas de mejora:</strong>')
    .replace(/Recomendaciones:/g, '<strong class="text-secondary-600">Recomendaciones:</strong>')
    .split('\n')
    .map(line => `<p>${line}</p>`)
    .join('');
}
