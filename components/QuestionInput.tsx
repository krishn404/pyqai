"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface QuestionInputProps {
  onSubmit: (question: string) => void
  subject: string
}

export default function QuestionInput({ onSubmit, subject }: QuestionInputProps) {
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim()) {
      setIsLoading(true)
      try {
        const response = await fetch("/api/generate-solution", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question, subject }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate solution")
        }

        const solution = await response.text()
        onSubmit(solution)

        // Save question to local storage
        const history = JSON.parse(localStorage.getItem("questionHistory") || "[]")
        history.unshift(question)
        localStorage.setItem("questionHistory", JSON.stringify(history.slice(0, 10))) // Keep only the last 10 questions
      } catch (error) {
        console.error("Error generating solution:", error)
        // Handle error (e.g., show an error message to the user)
      } finally {
        setIsLoading(false)
        setQuestion("")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your question here..."
        className="w-full"
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Generating Solution..." : "Submit Question"}
      </Button>
    </form>
  )
}

