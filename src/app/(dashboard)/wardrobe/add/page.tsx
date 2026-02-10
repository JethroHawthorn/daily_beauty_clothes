'use client'

import { addClothingItem } from '@/app/actions/wardrobe'
import { Button } from '@/components/ui/button'
import { ClothingItemForm } from '@/components/clothing-item-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useUser } from '@/hooks/use-user'

export default function AddClothingPage() {
  const { user } = useUser(true)

  if (!user) return null

  return (
    <div className="container mx-auto p-4 max-w-lg pb-24">
      <div className="mb-6">
        <Link href="/wardrobe">
          <Button variant="ghost" size="sm" className="-ml-3 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5 mr-1" strokeWidth={1.5} /> Quay lại
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Thêm trang phục mới ✨</h1>
      </div>

      <ClothingItemForm action={addClothingItem} />
    </div>
  )
}
