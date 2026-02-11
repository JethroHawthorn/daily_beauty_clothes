'use client'

import { getClothingItems, deleteClothingItem, toggleFavorite } from '@/app/actions/wardrobe'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Trash2, Plus, ArrowLeft, Shirt, ShoppingBag, ImageOff, Pencil } from 'lucide-react'
import { FavoriteButton } from '@/components/favorite-button'
import { WardrobeFilters } from '@/components/wardrobe-filters'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useUser } from '@/hooks/use-user'

// Defines the shape of an item as returned by getClothingItems
type ClothingItem = {
  id: string
  userId: string
  name: string
  type: string
  fit: string | null
  color: string | null
  material: string | null
  season: string[]
  imageUrl: string | null
  isFavorite: boolean | null
  createdAt: Date
  updatedAt: Date
}

function WardrobeContent() {
  const searchParams = useSearchParams()
  // Use custom hook for auth
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, isLoading: isUserLoading } = useUser(true) // Redirects if not found
  const [items, setItems] = useState<ClothingItem[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true)

  // Fetch Data
  useEffect(() => {
    if (!user) return

    const fetchItems = async () => {
      setIsDataLoading(true)
      const filters = {
        search: searchParams.get('search') || undefined,
        type: searchParams.get('type') || undefined,
        season: searchParams.get('season') || undefined,
        isFavorite: searchParams.get('isFavorite') === 'true'
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await getClothingItems(user.id, filters) as any[]
      setItems(data as ClothingItem[])
      setIsDataLoading(false)
    }

    fetchItems()
  }, [user, searchParams])

  const handleDelete = async (id: string) => {
    if (!user) return
    if (confirm('Bạn có chắc chắn muốn xóa món đồ này?')) {
      await deleteClothingItem(id, user.id)
      // Refresh local state to avoid full reload
      setItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const handleToggleFavorite = async (id: string, currentStatus: boolean) => {
    if (!user) return
    // Optimistic update
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, isFavorite: !currentStatus } : item
    ))
    await toggleFavorite(id, !currentStatus, user.id)
  }

  if (!user || isDataLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin text-4xl">🌸</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl h-[100dvh] flex flex-col">
      <div className="flex-none space-y-4 mb-4">
        <div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="-ml-3 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5 mr-1" /> Về trang chủ
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div className='flex items-center gap-2'>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Shirt className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Tủ đồ của tôi</h1>
          </div>
          <Link href="/wardrobe/add">
            <Button className="rounded-full shadow-soft hover:shadow-soft-hover bg-primary text-primary-foreground font-semibold px-4 h-9 text-sm">
              <Plus className="w-4 h-4 mr-1" /> Thêm món mới
            </Button>
          </Link>
        </div>

        <WardrobeFilters />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pb-24 pr-1 -mr-1">
        {items.length === 0 ? (
          <div className="text-center py-20 px-4 animate-in zoom-in duration-500">
            <div className="w-40 h-40 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft-hover text-pink-500">
              <ShoppingBag className="w-20 h-20" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">Tủ đồ đang trống</h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Hãy thêm trang phục để nhận gợi ý phối đồ nhé 💗
            </p>
            <Link href="/wardrobe/add">
              <Button size="lg" className="rounded-full text-lg h-14 px-8 shadow-soft hover:shadow-soft-hover font-bold">
                Thêm trang phục ngay
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {items.map(item => (
              <div key={item.id} className="group relative flex flex-col gap-2">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-muted/30">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground/30">
                      <ImageOff className="w-10 h-10" strokeWidth={1.5} />
                    </div>
                  )}

                  <div className="absolute top-2 right-2 z-10">
                    <FavoriteButton
                      isFavorite={item.isFavorite || false}
                      onToggle={() => handleToggleFavorite(item.id, item.isFavorite || false)}
                    />
                  </div>

                  <div className="absolute bottom-2 right-2 flex gap-1 flex-wrap justify-end max-w-[80%]">
                    {item.season?.map((s: string) => (
                      <span key={s} className="bg-black/40 backdrop-blur-md text-[10px] px-1.5 py-0.5 rounded-full text-white/90 font-medium border border-white/10 shadow-sm">
                        {s[0]}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-0.5 px-1">
                  <h3 className="font-semibold text-sm truncate text-foreground/90">{item.name}</h3>
                  <div className="flex justify-between items-center text-xs text-muted-foreground/80">
                    <span className="capitalize">{item.fit || item.type}</span>
                    <span className="text-muted-foreground/50">{item.color}</span>
                  </div>
                </div>

                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                  <Link href={`/wardrobe/edit/${item.id}`}>
                    <Button variant="ghost" size="icon-sm" className="h-8 w-8 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-primary hover:text-white transition-colors">
                      <Pencil className="w-4 h-4" strokeWidth={1.5} />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-8 w-8 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-destructive hover:text-white transition-colors"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function WardrobePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin text-4xl">🌸</div></div>}>
      <WardrobeContent />
    </Suspense>
  )
}
