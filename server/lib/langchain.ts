/**
 * This file implements the LangChain.js integration for AI evaluation
 */
import { evaluateText, extractSkills } from "./openai";

/**
 * Evaluate a submission using LangChain and OpenAI
 * 
 * @param content The submission content to evaluate
 * @param courseTitle The title of the course
 * @param category The category of the course
 * @returns Evaluation result with feedback, score, and skills
 */
export async function evaluateSubmission(
  content: string,
  courseTitle: string,
  category: string
): Promise<{
  feedback: string;
  score: number;
  skills: string[];
  details: any;
}> {
  try {
    console.log(`Evaluating submission for course: ${courseTitle}`);
    
    // In a production environment, this would use LangChain.js with more sophisticated
    // evaluation techniques, complex chains, and potentially LangChain Agents
    
    // For this implementation, we'll use our OpenAI wrapper directly
    const evaluation = await evaluateText(content, courseTitle, category);
    
    // If skills weren't extracted or are empty, try again directly
    if (!evaluation.skills || evaluation.skills.length === 0) {
      const skills = await extractSkills(content, courseTitle);
      evaluation.skills = skills;
    }
    
    console.log(`Evaluation complete. Score: ${evaluation.score}`);
    
    return {
      feedback: enrichFeedbackWithTemplates(evaluation.feedback, courseTitle, evaluation.score),
      score: evaluation.score,
      skills: evaluation.skills,
      details: evaluation.details
    };
  } catch (error) {
    console.error("Error in LangChain evaluation:", error);
    
    // Return fallback evaluation in case of error
    return {
      feedback: `No se pudo completar la evaluación. Por favor, intente nuevamente más tarde. Error: ${error.message}`,
      score: 0,
      skills: ["No se pudieron determinar"],
      details: { error: error.message }
    };
  }
}

/**
 * Enhance feedback with course-specific templates
 * 
 * @param feedback The raw feedback from AI
 * @param courseTitle The course title
 * @param score The evaluation score
 * @returns Enhanced feedback
 */
function enrichFeedbackWithTemplates(
  feedback: string,
  courseTitle: string,
  score: number
): string {
  // Add greeting and conclusion based on score
  const greeting = `Evaluación de tu trabajo para el curso "${courseTitle}":\n\n`;
  
  let conclusion;
  if (score >= 90) {
    conclusion = "\n\n¡Excelente trabajo! Has demostrado un dominio excepcional de los conceptos y habilidades requeridos.";
  } else if (score >= 70) {
    conclusion = "\n\nBuen trabajo. Has demostrado una comprensión sólida, aunque hay áreas específicas que podrías mejorar.";
  } else if (score >= 50) {
    conclusion = "\n\nTu trabajo muestra un entendimiento básico, pero requiere mejoras significativas en las áreas mencionadas.";
  } else {
    conclusion = "\n\nTu trabajo necesita una revisión sustancial. Te recomendamos revisar los materiales del curso y volver a intentarlo.";
  }
  
  return greeting + feedback + conclusion;
}

/**
 * Check if a submission meets the criteria for certification
 * 
 * @param score The evaluation score
 * @returns Whether the submission qualifies for certification
 */
export function meetsAttestationCriteria(score: number): boolean {
  // Submissions with a score of 70 or higher qualify for certification
  return score >= 70;
}

/**
 * Get the appropriate attestation title based on score
 * 
 * @param courseTitle The course title
 * @param score The evaluation score
 * @returns A suitable attestation title
 */
export function getAttestationTitle(courseTitle: string, score: number): string {
  if (score >= 90) {
    return `Certificación de Excelencia en ${courseTitle}`;
  } else if (score >= 80) {
    return `Certificación Avanzada en ${courseTitle}`;
  } else {
    return `Certificación en ${courseTitle}`;
  }
}

/**
 * Generate attestation description based on course and score
 * 
 * @param courseTitle The course title
 * @param score The evaluation score
 * @returns A suitable attestation description
 */
export function getAttestationDescription(courseTitle: string, score: number): string {
  if (score >= 90) {
    return `Ha completado con distinción el curso de ${courseTitle} demostrando un dominio excepcional evaluado por nuestro agente de IA.`;
  } else if (score >= 80) {
    return `Ha completado exitosamente el curso avanzado de ${courseTitle} con una evaluación destacada por parte del agente de IA.`;
  } else {
    return `Ha completado satisfactoriamente el curso de ${courseTitle} con una evaluación positiva por parte del agente de IA.`;
  }
}
