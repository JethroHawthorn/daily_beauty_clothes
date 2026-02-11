"use client"

import * as React from "react"
import { Outfit, ClothingItem } from "@/types/outfit"
import { BODY_MAP, DRAW_ORDER } from "@/lib/canvas-body-map"
import { loadImage } from "@/lib/load-image"
import { drawImageContain } from "@/lib/canvas-image-fit"
import { cn } from "@/lib/utils"

interface OutfitCanvasRendererProps {
  outfit: Outfit
  className?: string
}

// Simple silhouette SVG data URI
const SILHOUETTE_SVG = `
<svg viewBox="0 0 200 600" xmlns="http://www.w3.org/2000/svg">
  <path d="M100,50 C115,50 125,60 125,75 C125,90 115,100 100,100 C85,100 75,90 75,75 C75,60 85,50 100,50 Z M100,105 C130,105 150,130 150,160 L150,250 C150,250 160,350 130,350 L120,550 L80,550 L70,350 C40,350 50,250 50,250 L50,160 C50,130 70,105 100,105 Z" fill="#f5f5f5" />
</svg>
`
const SILHOUETTE_SRC = `data:image/svg+xml;utf8,${encodeURIComponent(SILHOUETTE_SVG.trim())}`

const PASTEL_COLORS: Record<string, string> = {
  top: "#FFD1DC",       // Pastel Pink
  bottom: "#AEC6CF",    // Pastel Blue
  shoes: "#FFE5B4",     // Pastel Peach
  outerwear: "#B39EB5", // Pastel Purple
  hat: "#FFB7B2",       // Pastel Coral
  glasses: "#B2EBF2",   // Pastel Cyan
  mask: "#E1BEE7",      // Pastel Lavender
  earrings: "#FFF176",  // Pastel Yellow
  default: "#E0E0E0",
}

export function OutfitCanvasRenderer({ outfit, className }: OutfitCanvasRendererProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    let active = true

    const render = async () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Reset loaded state for fade-in effect on change
      setIsLoaded(false)

      try {
        // 1. Load resources
        const silhouettePromise = loadImage(SILHOUETTE_SRC)

        // Prepare promises for clothing items
        const itemPromises = DRAW_ORDER.map(async (type) => {
          const item = outfit[type as keyof Outfit]
          if (item?.imageUrl) {
            try {
              return { type, img: await loadImage(item.imageUrl), item }
            } catch (error) {
              console.error(`Failed to load image for ${type}`, error)
              return { type, img: null, item }
            }
          }
          return { type, img: null, item }
        })

        // 2. Wait for all resources
        const silhouetteImg = await silhouettePromise
        const itemResults = await Promise.all(itemPromises)

        if (!active) return

        // 2. Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // 3. Draw Silhouette (Centered)
        // Canvas width 300, Silhouette width in viewbox 200 centered at 100.
        // We draw it at x=50 to center 100 on 150.
        ctx.drawImage(silhouetteImg, 50, 0, 200, 600)

        // 4. Draw Items
        itemResults.forEach(({ type, img, item }) => {
          if (!item) return

          const box = BODY_MAP[type as keyof typeof BODY_MAP]
          if (!box) return

          if (img) {
            drawImageContain(ctx, img, box)
          } else {
            // Fallback: Rectangle + Text
            ctx.fillStyle = PASTEL_COLORS[type] || PASTEL_COLORS.default
            ctx.fillRect(box.x, box.y, box.w, box.h)

            ctx.fillStyle = "#666666"
            ctx.font = "14px sans-serif"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText(item.name || type, box.x + box.w / 2, box.y + box.h / 2)
          }
        })

        setIsLoaded(true)
      } catch (err) {
        console.error("Canvas render error:", err)
      }
    }

    render()

    return () => {
      active = false
    }
  }, [outfit])

  return (
    <div className={cn(
      "bg-white rounded-2xl shadow-sm p-4 transition-opacity duration-500",
      className
    )}>
      <canvas
        ref={canvasRef}
        width={300}
        height={600}
        className={cn(
          "w-full h-auto mx-auto transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  )
}
