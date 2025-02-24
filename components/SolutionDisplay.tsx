import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface SolutionDisplayProps {
  solution: string
  isLoading: boolean
}

export default function SolutionDisplay({ solution, isLoading }: SolutionDisplayProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(solution)
  }

  const handleDownload = () => {
    const blob = new Blob([solution], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "solution.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solution</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Generating solution...</p>
        ) : solution ? (
          <pre className="whitespace-pre-wrap">{solution}</pre>
        ) : (
          <p>No solution generated yet.</p>
        )}
      </CardContent>
      <CardFooter className="space-x-2">
        <Button onClick={handleCopy} disabled={!solution}>
          Copy
        </Button>
        <Button onClick={handleDownload} disabled={!solution}>
          Download
        </Button>
      </CardFooter>
    </Card>
  )
}

