import { getClothingItems, deleteClothingItem } from '@/app/actions/wardrobe'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import Image from 'next/image'
import { ArrowLeft, Trash2, Plus } from 'lucide-react'

export default async function WardrobePage() {
    const items = await getClothingItems()

    return (
        <div className="container mx-auto p-4 pb-20 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <Link href="/" className="flex items-center text-sm font-medium hover:underline">
                    <ArrowLeft className="w-5 h-5 mr-1" /> Trang chủ
                </Link>
                <h1 className="text-xl font-bold">Tủ đồ ({items.length})</h1>
                <Link href="/wardrobe/add">
                    <Button size="sm"><Plus className="w-4 h-4 mr-1"/> Thêm</Button>
                </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map(item => (
                    <Card key={item.id} className="overflow-hidden flex flex-col h-full">
                        <div className="relative aspect-square w-full bg-gray-100 dark:bg-zinc-800">
                           {item.imageUrl ? (
                               <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                           ) : (
                               <div className="flex items-center justify-center h-full text-gray-400 text-sm">Chưa có ảnh</div>
                           )}
                           <div className="absolute top-1 right-1">
                                {item.season?.map((s: string) => s[0]).join('')}
                           </div>
                        </div>
                        <CardContent className="p-3 flex-grow">
                            <h3 className="font-semibold truncate text-sm">{item.name}</h3>
                            <p className="text-xs text-gray-500 capitalize">{item.color} {item.type}</p>
                            <p className="text-xs text-gray-400">{item.style}</p>
                        </CardContent>
                        <CardFooter className="p-3 pt-0">
                           <form action={async () => {
                               'use server'
                               await deleteClothingItem(item.id)
                           }} className="w-full">
                               <Button variant="ghost" size="sm" className="w-full h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20">
                                   <Trash2 className="w-4 h-4 mr-1" /> Xoá
                               </Button>
                           </form>
                        </CardFooter>
                    </Card>
                ))}
            </div>
             {items.length === 0 && (
                <div className="text-center py-16 px-4">
                    <div className="bg-gray-100 dark:bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">👕</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Tủ đồ đang trống</h3>
                    <p className="text-gray-500 text-sm mb-6">Thêm quần áo để nhận gợi ý từ AI.</p>
                    <Link href="/wardrobe/add">
                        <Button>Thêm món đầu tiên</Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
