"use client"

import { useState } from "react"
import ChatInterface from "@/components/ChatInterface"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [subject, setSubject] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1C1C1C] to-[#2C2C2C] text-gray-200">
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="bg-[#242424] border-b border-[#333333] p-4 flex items-center">
            <h2 className="text-lg font-medium ml-4">Chat</h2>
          </header>

          <main className="flex-1 overflow-hidden">
            <ChatInterface subject={subject} />
          </main>
        </div>
      </div>
    </div>
  )
}
