import { getClothingItem, updateClothingItem } from '@/app/actions/wardrobe'
import { ClothingItemForm } from '@/components/clothing-item-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Props = {
    params: Promise<{ id: string }>
}

export default async function EditClothingPage({ params }: Props) {
    const { id } = await params
    const item = await getClothingItem(id)

    if (!item) {
        notFound()
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
                initialData={item as any} 
                submitLabel="Lưu thay đổi"
                pendingLabel="Đang sửa..."
             />
        </div>
    )
}
