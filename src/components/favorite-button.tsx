'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleFavorite } from '@/app/actions/wardrobe'
import { useTransition } from 'react'

interface FavoriteButtonProps {
    itemId: string
    isFavorite: boolean
}

export function FavoriteButton({ itemId, isFavorite }: FavoriteButtonProps) {
    const [isPending, startTransition] = useTransition()

    const handleToggle = () => {
        startTransition(async () => {
            await toggleFavorite(itemId, !isFavorite)
        })
    }

    return (
        <Button 
            variant="ghost" 
            size="icon-sm" 
            className={`h-8 w-8 backdrop-blur-md rounded-full shadow-sm transition-colors ${
                isFavorite 
                ? 'bg-rose-100 text-rose-500 hover:bg-rose-200' 
                : 'bg-white/80 text-muted-foreground hover:bg-rose-50 hover:text-rose-400'
            }`}
            onClick={handleToggle}
            disabled={isPending}
        >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            <span className="sr-only">Yêu thích</span>
        </Button>
    )
}
