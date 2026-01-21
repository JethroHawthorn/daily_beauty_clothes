'use client'

import { useActionState } from 'react'
import { addClothingItem } from '@/app/actions/wardrobe'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AddClothingPage() {
    const [state, action, isPending] = useActionState(addClothingItem, undefined)

    return (
        <div className="container mx-auto p-4 max-w-lg pb-20">
             <div className="mb-6 flex items-center justify-between">
                 <Link href="/wardrobe" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-1" /> Quay xe
                 </Link>
                 <h1 className="text-xl font-bold">Khoe món mới</h1>
                 <div className="w-10"></div> {/* Spacer */}
             </div>
             
             <form action={action} className="space-y-8">
                {/* Image Upload Area */}
                <div className="relative aspect-square w-full rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/10 hover:bg-muted/20 transition-colors group cursor-pointer overflow-hidden">
                    <input name="image" id="image" type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground pointer-events-none">
                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <span className="text-2xl">📷</span>
                        </div>
                        <span className="text-sm font-medium">Chạm nhẹ để khoe ảnh</span>
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <Label htmlFor="name" className="text-base font-semibold mb-2 block">Tên em nó là gì?</Label>
                        <Input name="name" id="name" required placeholder="Ví dụ: Áo khoác Jean 'chất lừ'" className="h-12 bg-white/50" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="type" className="text-base font-semibold mb-2 block">Thuộc hệ nào?</Label>
                            <Input name="type" id="type" required placeholder="Áo, Quần, Váy..." className="h-12 bg-white/50" />
                        </div>
                        <div>
                            <Label htmlFor="brand" className="text-base font-semibold mb-2 block">Đến từ đâu?</Label>
                            <Input name="brand" id="brand" placeholder="Zara, Local Brand..." className="h-12 bg-white/50" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="style" className="text-base font-semibold mb-2 block">Gu gì đây?</Label>
                            <Input name="style" id="style" placeholder="Bánh bèo, Cá tính..." className="h-12 bg-white/50" />
                        </div>
                        <div>
                            <Label htmlFor="color" className="text-base font-semibold mb-2 block">Màu mè ra sao?</Label>
                            <Input name="color" id="color" placeholder="Xanh, Đỏ, Tím..." className="h-12 bg-white/50" />
                        </div>
                    </div>
                     <div>
                        <Label htmlFor="material" className="text-base font-semibold mb-2 block">Chất liệu</Label>
                        <Input name="material" id="material" placeholder="Jean, Cotton, Lụa..." className="h-12 bg-white/50" />
                    </div>
                    
                    <div>
                        <Label className="text-base font-semibold mb-3 block">Mùa nào diện được?</Label>
                        <div className="flex flex-wrap gap-2">
                            {['Xuân', 'Hạ', 'Thu', 'Đông'].map((s) => (
                                <label key={s} className="relative group cursor-pointer">
                                    <input type="checkbox" name="season" value={s} className="peer sr-only" />
                                    <span className="block px-4 py-2 bg-white border rounded-full text-sm font-medium text-muted-foreground transition-all peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary peer-checked:shadow-sm hover:bg-gray-50">
                                        {s}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-14 text-lg rounded-full shadow-soft hover:shadow-soft-hover mt-4 font-bold" disabled={isPending}>
                        {isPending ? 'Đang nhét vào tủ...' : 'Nạp vào kho!'}
                    </Button>
                    
                    {state?.success && <p className="text-green-600 text-center font-medium bg-green-50 p-2 rounded-lg">Xong! Hàng đã về bản.</p>}
                    {state?.errors?._form && <p className="text-destructive text-center">{state.errors._form}</p>}
                </div>
            </form>
        </div>
    )
}
