"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function QuestionHistory() {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    const storedHistory = localStorage.getItem("questionHistory")
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory))
    }
  }, [])

  const clearHistory = () => {
    localStorage.removeItem("questionHistory")
    setHistory([])
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Question History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <ul className="space-y-2">
            {history.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        ) : (
          <p>No question history available.</p>
        )}
        <Button onClick={clearHistory} className="mt-4" variant="destructive">
          Clear History
        </Button>
      </CardContent>
    </Card>
  )
}

