import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "sk-dummy-key-for-development"
});

/**
 * Evaluate academic or technical text using OpenAI
 * 
 * @param text The text to evaluate
 * @param context Additional context like course title, category, etc.
 * @returns Structured evaluation result with feedback and score
 */
export async function evaluateText(
  text: string, 
  courseTitle: string,
  category: string
): Promise<{
  feedback: string;
  score: number;
  skills: string[];
  details: any;
}> {
  try {
    const prompt = `
      Por favor, evalúa el siguiente trabajo académico:
      
      Curso: ${courseTitle}
      Categoría: ${category}
      
      Trabajo:
      ${text.substring(0, 8000)} // Limit to 8000 chars for token limits
      
      Evalúa este trabajo académico considerando:
      1. Claridad y organización
      2. Calidad del análisis
      3. Uso de fuentes y referencias
      4. Metodología y enfoque
      5. Originalidad y relevancia
      
      Proporciona un análisis estructurado en formato JSON con los siguientes elementos:
      - feedback: Retroalimentación detallada en español, con secciones de "Fortalezas:", "Áreas de mejora:", y "Recomendaciones:"
      - score: Puntuación numérica de 0 a 100 
      - skills: Un array de 3-5 habilidades demostradas en el trabajo
      - details: Objeto con detalles del análisis por categorías
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "Eres un profesor experto que evalúa trabajos académicos y técnicos con rigor y objetividad."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No se pudo obtener respuesta de la IA");
    }

    const result = JSON.parse(content);

    // Return a standardized evaluation format
    return {
      feedback: result.feedback || "No se pudo generar retroalimentación.",
      score: typeof result.score === "number" ? result.score : 0,
      skills: Array.isArray(result.skills) ? result.skills : [],
      details: result.details || {}
    };
  } catch (error) {
    console.error("Error al evaluar texto con OpenAI:", error);
    
    // Return a fallback evaluation
    return {
      feedback: "No se pudo completar la evaluación automática. Por favor, intente nuevamente más tarde.",
      score: 0,
      skills: [],
      details: { error: error.message }
    };
  }
}

/**
 * Generate a summary of a student's skills based on their work
 * 
 * @param text The student's work to analyze
 * @param courseTitle The title of the course
 * @returns Array of identified skills
 */
export async function extractSkills(
  text: string,
  courseTitle: string
): Promise<string[]> {
  try {
    const prompt = `
      Analiza el siguiente trabajo académico y extrae las 5 habilidades más destacadas que el estudiante demuestra:
      
      Curso: ${courseTitle}
      
      Trabajo:
      ${text.substring(0, 4000)} // Limit to 4000 chars
      
      Responde únicamente con un array JSON de strings, cada uno representando una habilidad específica.
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "Eres un analizador de competencias que identifica habilidades demostradas en trabajos académicos."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return ["Análisis de datos", "Comunicación escrita", "Pensamiento crítico"];
    }

    try {
      const result = JSON.parse(content);
      return Array.isArray(result.skills) ? result.skills : 
             Array.isArray(result) ? result :
             ["Análisis de datos", "Comunicación escrita", "Pensamiento crítico"];
    } catch {
      return ["Análisis de datos", "Comunicación escrita", "Pensamiento crítico"];
    }
  } catch (error) {
    console.error("Error al extraer habilidades con OpenAI:", error);
    return ["Análisis de datos", "Comunicación escrita", "Pensamiento crítico"];
  }
}
