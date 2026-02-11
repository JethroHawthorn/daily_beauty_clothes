"use client"

import * as React from "react"
import Image from "next/image"
import { Shirt, Footprints, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import { ClothingItem, Outfit } from "@/types/outfit"

interface OutfitPreviewSkeletonProps {
  outfit?: Outfit
  className?: string
}

export function OutfitPreviewSkeleton({ outfit, className }: OutfitPreviewSkeletonProps) {
  const isEmpty = !outfit || Object.keys(outfit).length === 0

  if (isEmpty) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-[420px] w-full bg-muted/30 rounded-xl border border-dashed border-neutral-200", className)}>
        <p className="text-muted-foreground/50 text-sm font-medium">Combo sẽ xuất hiện ở đây</p>
      </div>
    )
  }

  return (
    <div className={cn("relative mx-auto w-full max-w-[320px] h-[500px] sm:h-[520px] flex justify-center", className)}>
      {/* Silhouette Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex justify-center">
        <svg viewBox="0 0 200 600" className="h-full w-auto text-rose-900 fill-current" preserveAspectRatio="xMidYMid meet">
          <path d="M100,50 C115,50 125,60 125,75 C125,90 115,100 100,100 C85,100 75,90 75,75 C75,60 85,50 100,50 Z M100,105 C130,105 150,130 150,160 L150,250 C150,250 160,350 130,350 L120,550 L80,550 L70,350 C40,350 50,250 50,250 L50,160 C50,130 70,105 100,105 Z" />
        </svg>
      </div>

      {/* Layers */}
      <div className="relative z-10 w-full h-full">
        {/* Top - Upper Body */}
        <OutfitZone
          item={outfit?.top}
          type="top"
          className="top-[12%] left-1/2 -translate-x-1/2 w-[160px] h-[180px] z-20"
          placeholderIcon={<Shirt className="w-8 h-8 text-neutral-300" />}
        />

        {/* Bottom - Lower Body */}
        <OutfitZone
          item={outfit?.bottom}
          type="bottom"
          className="top-[42%] left-1/2 -translate-x-1/2 w-[160px] h-[220px] z-10"
          placeholderIcon={<div className="w-8 h-8 text-neutral-300 border-2 border-current rounded-md" />}
        />

        {/* Outerwear - Overlay */}
        <OutfitZone
          item={outfit?.outerwear}
          type="outerwear"
          className="top-[10%] left-1/2 -translate-x-1/2 w-[190px] h-[260px] z-30 pointer-events-none"
          placeholderIcon={<Layers className="w-8 h-8 text-neutral-300" />}
          isOverlay
        />

        {/* Shoes - Feet */}
        <OutfitZone
          item={outfit?.shoes}
          type="shoes"
          className="bottom-[2%] left-1/2 -translate-x-1/2 w-[140px] h-[100px] z-20"
          placeholderIcon={<Footprints className="w-8 h-8 text-neutral-300" />}
        />
      </div>
    </div>
  )
}

function OutfitZone({
  item,
  type,
  className,
  placeholderIcon,
  isOverlay = false
}: {
  item?: ClothingItem
  type: string
  className?: string
  placeholderIcon: React.ReactNode
  isOverlay?: boolean
}) {
  if (!item && isOverlay) return null; // Don't render empty overlay

  return (
    <div className={cn(
      "absolute transition-all duration-300 ease-in-out hover:scale-105",
      !item ? "opacity-50" : "opacity-100 animate-in fade-in zoom-in-95",
      className
    )}>
      {item ? (
        <div className={cn(
          "w-full h-full relative",
          !item.imageUrl && !isOverlay && "rounded-xl overflow-hidden shadow-sm bg-white/80 backdrop-blur-sm border border-white/40"
        )}>
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-contain drop-shadow-sm"
              sizes="(max-width: 768px) 150px, 200px"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-rose-50/50 p-2 text-center">
              <div className="mb-1 opacity-50">{placeholderIcon}</div>
              <span className="text-xs font-medium text-foreground/70 line-clamp-2 leading-tight px-1">
                {item.name}
              </span>
            </div>
          )}
          {/* Label Tag */}
          {!isOverlay && (
            <div className="absolute bottom-1 left-1 bg-white/90 backdrop-blur text-[10px] px-2 py-0.5 rounded-full shadow-sm text-muted-foreground border border-neutral-100 max-w-[90%] truncate">
              {item.name}
            </div>
          )}
        </div>
      ) : (
        // Placeholder state (only for core items)
        !isOverlay && (
          <div className="w-full h-full rounded-xl border-2 border-dashed border-neutral-200 flex items-center justify-center bg-muted/20">
            {placeholderIcon}
          </div>
        )
      )}
    </div>
  )
}
