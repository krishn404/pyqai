import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { PromptTemplate } from "@langchain/core/prompts"

export const runtime = "nodejs"
export const maxDuration = 60

const SYSTEM_PROMPT = `You are an AI tutor that provides detailed solutions to academic questions.
Your responses should be clear, structured, and educational.`

const apiKey = process.env.GROQ_API_KEY

export async function POST(req: Request) {
  try {
    const { question, subject } = await req.json()

    if (!apiKey) {
      return new Response("API key is missing", { status: 500 })
    }

    const prompt = PromptTemplate.fromTemplate(`
      You are an AI tutor specializing in {subject}. 
      Provide a detailed solution to the following question:

      Question: {question}

      Please structure your answer in the following format:
      1. Understand the problem
      2. Identify key concepts
      3. Step-by-step solution
      4. Final answer (if applicable)
      5. Additional explanations or related concepts
    `)

    const formattedPrompt = await prompt.format({
      question: question,
      subject: subject,
    })

    const { text } = await generateText({
      model: groq("mixtral-8x7b-32768"),
      system: SYSTEM_PROMPT,
      prompt: formattedPrompt,
    })

    return new Response(text)
  } catch (error) {
    console.error("Error in generate-solution:", error)
    return new Response(JSON.stringify({ error: "An error occurred while generating the solution" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
