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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Fooocus Generator
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Transform your ideas into stunning AI-generated images with just a few words
          </p>
        </div>

        {/* Input Form */}
        <Card className="max-w-2xl mx-auto p-6 mb-8 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Describe your vision... (e.g., 'A serene mountain landscape at sunset')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={generating}
                className="text-lg py-6 pr-24 border-2 focus:border-purple-500 transition-colors"
              />
              <Button
                type="submit"
                disabled={generating || !prompt}
                className="absolute right-2 top-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                size="lg"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
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
              <div className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-lg font-medium">Creating your masterpiece...</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {images.length > 0
              ? images.map((src, i) => (
                  <Card
                    key={i}
                    className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800"
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
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-slate-900 hover:bg-white"
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
                  <Card key={i} className="overflow-hidden border-0 shadow-lg bg-white dark:bg-slate-800">
                    <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 animate-pulse relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
                      </div>
                    </div>
                  </Card>
                ))}
          </div>

          {images.length > 0 && (
            <div className="text-center mt-8">
              <p className="text-slate-600 dark:text-slate-400">
                Generated {images.length} image{images.length !== 1 ? "s" : ""} • Hover to download
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
