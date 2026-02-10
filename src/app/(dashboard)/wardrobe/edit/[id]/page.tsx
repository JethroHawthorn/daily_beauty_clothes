'use client'

import { getClothingItem, updateClothingItem } from '@/app/actions/wardrobe'
import { ClothingItemForm } from '@/components/clothing-item-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, use } from 'react'
import { useUser } from '@/hooks/use-user'

type Props = {
  params: Promise<{ id: string }>
}

export default function EditClothingPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [item, setItem] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useUser(true)

  useEffect(() => {
    if (!user) return

    const fetchItem = async () => {
      const data = await getClothingItem(id, user.id)
      if (!data) {
        router.push('/wardrobe') // Not found or not owned
        return
      }
      setItem(data)
      setIsLoading(false)
    }
    fetchItem()
  }, [id, router, user])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin text-4xl">🌸</div>
      </div>
    )
  }

  // Bind current ID to update action
  const updateAction = updateClothingItem.bind(null, id)

  return (
    <div className="container mx-auto p-4 max-w-lg pb-24">
      <div className="mb-6">
        <Link href="/wardrobe">
          <Button variant="ghost" size="sm" className="-ml-3 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5 mr-1" /> Quay lại
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Sửa sang lại nào 🛠️</h1>
      </div>

      <ClothingItemForm
        action={updateAction}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        initialData={item as any}
        submitLabel="Lưu thay đổi"
        pendingLabel="Đang sửa..."
      />
    </div>
  )
}
