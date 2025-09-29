"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Loader2, Sparkles, Download } from "lucide-react"

export default function FooocusGenerator() {
  const [prompt, setPrompt] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [status, setStatus] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt || generating) return
    setGenerating(true)
    setImages([])
    setStatus("")

    try {
      const requests = Array.from({ length: 4 }, () =>
        fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, steps: 4 }),
        }).then((res) => res.json()),
      )

      const results = await Promise.all(requests)
      const generatedImages = results
        .filter((data) => data.success && data.result?.image)
        .map((data) => "data:image/jpeg;base64," + data.result.image)

      setImages(generatedImages)
      if (generatedImages.length === 0) {
        setStatus("Generation failed.")
      }
    } catch (err: any) {
      console.error(err)
      setStatus("An error occurred.")
    } finally {
      setGenerating(false)
    }
  }

  const downloadImage = (src: string, index: number) => {
    const link = document.createElement("a")
    link.href = src
    link.download = `fooocus-generated-${index + 1}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-black dark:text-gray-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* <Sparkles className="h-8 w-8 text-primary " /> */}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              !magen
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {/* Transform your ideas into stunning AI-generated images with just a few words */}
          </p>
        </div>

        {/* Input Form */}
        <Card className="max-w-2xl mx-auto p-6 mb-8 shadow-sm border bg-card/80 backdrop-blur-sm dark:bg-card/80 dark:border-card/80">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Describe your vision... (e.g., 'A serene mountain landscape at sunset')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={generating}
                className="text-lg py-6 pr-32 border-2 focus:border-primary transition-colors bg-background/50 dark:bg-background/50"
              />
              <Button
                type="submit"
                disabled={generating || !prompt}
                className="absolute font-semibold right-2 top-2 bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-sm"
                size="lg"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  < >
                    {/* <Sparkles className="h-4 w-4 mr-2" /> */}
                    Generate
                  </>
                )}
              </Button>
            </div>

            {status && (
              <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                {status}
              </div>
            )}
          </form>
        </Card>

        {/* Results Grid */}
        <div className="max-w-6xl mx-auto">
          {generating && (
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 text-primary">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-lg font-medium">Creating your mastershit...</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {images.length > 0
              ? images.map((src, i) => (
                  <Card
                    key={i}
                    className="group overflow-hidden border bg-card hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="relative aspect-square">
                      <img
                        src={src || "/placeholder.svg"}
                        alt={`Generated: ${prompt}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <Button
                          onClick={() => downloadImage(src, i)}
                          size="sm"
                          variant="secondary"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/90 hover:bg-background text-foreground"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              : generating &&
                Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden border bg-card/50">
                    <div className="aspect-square bg-muted/50 animate-pulse relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-muted-foreground/50 animate-spin" />
                      </div>
                    </div>
                  </Card>
                ))}
          </div>

          {images.length > 0 && (
            <div className="text-center mt-8">
              <p className="text-muted-foreground">
                Generated {images.length} image{images.length !== 1 ? "s" : ""} • Hover to download
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
