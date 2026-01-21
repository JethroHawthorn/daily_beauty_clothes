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
        <div className="container mx-auto p-4 max-w-lg">
             <div className="mb-4">
                 <Link href="/wardrobe" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại tủ đồ
                 </Link>
             </div>
             <Card>
                <CardHeader>
                    <CardTitle>Thêm món đồ mới</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Tên</Label>
                            <Input name="name" id="name" required placeholder="Ví dụ: Áo khoác Jean xanh" />
                        </div>
                        <div>
                            <Label htmlFor="type">Loại</Label>
                            <Input name="type" id="type" required placeholder="Ví dụ: Áo khoác, Sơ mi, Quần" />
                        </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="style">Phong cách</Label>
                                <Input name="style" id="style" placeholder="Ví dụ: Casual, Tiệc tùng" />
                            </div>
                            <div>
                                <Label htmlFor="color">Màu sắc</Label>
                                <Input name="color" id="color" placeholder="Ví dụ: Xanh dương" />
                            </div>
                         </div>
                         <div>
                            <Label htmlFor="material">Chất liệu</Label>
                            <Input name="material" id="material" placeholder="Ví dụ: Jean, Cotton" />
                        </div>
                        
                        <div>
                            <Label>Mùa</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {['Xuân', 'Hạ', 'Thu', 'Đông'].map((s) => (
                                    <label key={s} className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800">
                                        <input type="checkbox" name="season" value={s} className="accent-black" />
                                        <span>{s}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="image">Hình ảnh</Label>
                            <Input name="image" id="image" type="file" accept="image/*" className="cursor-pointer" />
                        </div>

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? 'Đang lưu...' : 'Thêm món đồ'}
                        </Button>
                        {state?.success && <p className="text-green-600 text-center font-medium">Thêm thành công!</p>}
                        {state?.errors?._form && <p className="text-red-600 text-center">{state.errors._form}</p>}
                    </form>
                </CardContent>
             </Card>
        </div>
    )
}
