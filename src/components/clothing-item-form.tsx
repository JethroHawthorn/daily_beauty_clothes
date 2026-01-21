'use client'

import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, ImageOff } from 'lucide-react'
import Image from 'next/image'

type Props = {
    action: (prevState: any, formData: FormData) => Promise<any>
    initialData?: {
        name: string
        type: string
        brand?: string | null
        style?: string | null
        color?: string | null
        material?: string | null
        season?: string[] | null
        imageUrl?: string | null
    }
    submitLabel?: string
    pendingLabel?: string
}

export function ClothingItemForm({ action, initialData, submitLabel = 'Nạp vào kho!', pendingLabel = 'Đang nhét vào tủ...' }: Props) {
    const [state, formAction, isPending] = useActionState(action, undefined)

    return (
        <form action={formAction} className="space-y-8">
            {/* Image Upload Area */}
            <div className="relative aspect-square w-full rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/10 hover:bg-muted/20 transition-colors group cursor-pointer overflow-hidden">
                <input name="image" id="image" type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                
                {initialData?.imageUrl ? (
                     <Image src={initialData.imageUrl} alt="Current" fill className="object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                ) : null}

                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground pointer-events-none">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform z-20">
                        <Camera className="w-8 h-8 opacity-80" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-medium bg-white/50 backdrop-blur-sm rounded-full px-3 py-1 z-20">Chạm nhẹ để khoe ảnh</span>
                </div>
            </div>

            <div className="space-y-5">
                <div>
                    <Label htmlFor="name" className="text-base font-semibold mb-2 block">Tên em nó là gì?</Label>
                    <Input name="name" id="name" required defaultValue={initialData?.name} placeholder="Ví dụ: Áo khoác Jean 'chất lừ'" className="h-12 bg-white/50" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="type" className="text-base font-semibold mb-2 block">Thuộc hệ nào?</Label>
                        <Input name="type" id="type" required defaultValue={initialData?.type} placeholder="Áo, Quần, Váy..." className="h-12 bg-white/50" />
                    </div>
                    <div>
                        <Label htmlFor="brand" className="text-base font-semibold mb-2 block">Đến từ đâu?</Label>
                        <Input name="brand" id="brand" defaultValue={initialData?.brand || ''} placeholder="Zara, Local Brand..." className="h-12 bg-white/50" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="style" className="text-base font-semibold mb-2 block">Gu gì đây?</Label>
                        <Input name="style" id="style" defaultValue={initialData?.style || ''} placeholder="Bánh bèo, Cá tính..." className="h-12 bg-white/50" />
                    </div>
                    <div>
                        <Label htmlFor="color" className="text-base font-semibold mb-2 block">Màu mè ra sao?</Label>
                        <Input name="color" id="color" defaultValue={initialData?.color || ''} placeholder="Xanh, Đỏ, Tím..." className="h-12 bg-white/50" />
                    </div>
                </div>
                    <div>
                    <Label htmlFor="material" className="text-base font-semibold mb-2 block">Chất liệu</Label>
                    <Input name="material" id="material" defaultValue={initialData?.material || ''} placeholder="Jean, Cotton, Lụa..." className="h-12 bg-white/50" />
                </div>
                
                <div>
                    <Label className="text-base font-semibold mb-3 block">Mùa nào diện được?</Label>
                    <div className="flex flex-wrap gap-2">
                        {['Xuân', 'Hạ', 'Thu', 'Đông'].map((s) => (
                            <label key={s} className="relative group cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="season" 
                                    value={s} 
                                    defaultChecked={initialData?.season?.includes(s)}
                                    className="peer sr-only" 
                                />
                                <span className="block px-4 py-2 bg-white border rounded-full text-sm font-medium text-muted-foreground transition-all peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary peer-checked:shadow-sm hover:bg-gray-50">
                                    {s}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <Button type="submit" className="w-full h-14 text-lg rounded-full shadow-soft hover:shadow-soft-hover mt-4 font-bold" disabled={isPending}>
                    {isPending ? pendingLabel : submitLabel}
                </Button>
                
                {state?.success && <p className="text-green-600 text-center font-medium bg-green-50 p-2 rounded-lg">Xong! Hàng đã về bản.</p>}
                {state?.errors?._form && <p className="text-destructive text-center">{state.errors._form}</p>}
            </div>
        </form>
    )
}
