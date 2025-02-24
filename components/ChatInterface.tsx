"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Check, Send } from "lucide-react"
import { toast } from "sonner"
import PDFUploader from "@/components/PDFUploader"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface ChatInterfaceProps {
  subject: string
}

export default function ChatInterface({ subject }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(messageId)
      toast.success("Copied to clipboard!")
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      toast.error("Failed to copy text")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === "") return

    const userMessage: Message = { 
      id: crypto.randomUUID(),
      role: "user", 
      content: input,
      timestamp: new Date().toLocaleTimeString() 
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/generate-solution", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input, subject }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const solution = await response.text()
      const assistantMessage: Message = { 
        id: crypto.randomUUID(),
        role: "assistant", 
        content: solution,
        timestamp: new Date().toLocaleTimeString() 
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating solution:", error)
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I encountered an error while generating the solution. Please try again.",
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTextExtracted = (text: string) => {
    setInput(text)
  }

  return (
    <div className="flex flex-col h-full bg-[#1C1C1C] p-4">
      <ScrollArea ref={scrollAreaRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <div className="mb-4">
              <span className="text-4xl">🎓</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Welcome to PYQ Solver</h3>
            <p className="text-sm max-w-md">
              Ask any question from your previous year papers and get detailed explanations.
            </p>
          </div>
        )}
        {messages.map((message) => (
          <Card 
            key={message.id} 
            className={`
              relative group 
              ${message.role === "user" ? "bg-zinc-700 text-white ml-auto" : "bg-zinc-900 text-white"}
              transition-all duration-200 hover:shadow-md rounded-lg mb-2
            `}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <p className="font-semibold text-sm mb-2">
                  {message.role === "user" ? "You" : "AI"}:
                </p>
                <span className="text-xs text-gray-300">{message.timestamp}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copyToClipboard(message.content, message.id)}
                >
                  {copiedId === message.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="whitespace-pre-wrap">{message.content}</div>
            </CardContent>
          </Card>
        ))}
      </ScrollArea>

      <div className="border-t border-[#333333] p-4">
        {/* <PDFUploader onTextExtracted={handleTextExtracted} /> */}
        <div className="flex gap-2 mt-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            className="min-h-[50px] bg-[#242424] border-[#333333] focus:ring-[#4CAF50] text-white"
            onKeyDown={handleKeyDown}
          />
          <Button 
            className="bg-[#4CAF50] hover:bg-[#45a049]"
            disabled={isLoading || !input.trim()}
            onClick={handleSubmit}
          >
            {isLoading ? "AI is typing..." : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
