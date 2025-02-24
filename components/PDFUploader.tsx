"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Paperclip } from "lucide-react"

interface PDFUploaderProps {
  onTextExtracted: (text: string) => void
}

export default function PDFUploader({ onTextExtracted }: PDFUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      try {
        // Simulate PDF text extraction
        const extractedText = `Extracted text from ${file.name}`
        onTextExtracted(extractedText)
        toast.success("File uploaded and text extracted!")
      } catch (error) {
        toast.error("Failed to extract text from file")
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  // return (
  //   <div className="flex items-center mt-4">
  //     <input
  //       type="file"
  //       accept=".pdf, .jpg, .jpeg, .png"
  //       onChange={handleFileUpload}
  //       ref={fileInputRef}
  //       className="hidden"
  //     />
  //     <Button 
  //       onClick={handleButtonClick} 
  //       className="bg-transparent border border-gray-400 text-gray-400 flex items-center"
  //       disabled={isUploading}
  //     >
  //       <Paperclip className="mr-2" />
  //       {/* {isUploading ? "Uploading..." : "Upload PDF/Image"} */}
  //     </Button>
  //     {isUploading && <p className="mt-2 text-gray-400">Uploading and extracting text...</p>}
  //   </div>
  // )
}

