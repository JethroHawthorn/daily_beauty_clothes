'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FavoriteButtonProps {
  isFavorite: boolean
  onToggle: () => void
  disabled?: boolean
}

export function FavoriteButton({ isFavorite, onToggle, disabled }: FavoriteButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={`h-8 w-8 backdrop-blur-md rounded-full shadow-sm transition-colors ${isFavorite
          ? 'bg-rose-100 text-rose-500 hover:bg-rose-200'
          : 'bg-white/80 text-muted-foreground hover:bg-rose-50 hover:text-rose-400'
        }`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onToggle()
      }}
      disabled={disabled}
    >
      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
      <span className="sr-only">Yêu thích</span>
    </Button>
  )
}
