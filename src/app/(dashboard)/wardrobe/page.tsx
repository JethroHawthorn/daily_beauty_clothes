import { getClothingItems, deleteClothingItem } from '@/app/actions/wardrobe'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import Image from 'next/image'
import { ArrowLeft, Trash2, Plus } from 'lucide-react'

export default async function WardrobePage() {
    const items = await getClothingItems()

    return (
        <div className="container mx-auto p-4 pb-20 max-w-7xl">
            <div className="flex items-center justify-between mb-8">
                 <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Lãnh địa quần áo 👗</h1>
                    <p className="text-muted-foreground mt-1">Gia tài của bạn đây rồi</p>
                 </div>
                 <Link href="/wardrobe/add">
                    <Button className="rounded-full shadow-soft hover:shadow-soft-hover bg-primary text-primary-foreground font-semibold px-6">
                        <Plus className="w-5 h-5 mr-2" /> Sắm đồ mới à?
                    </Button>
                 </Link>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-20 px-4 animate-in zoom-in duration-500">
                    <div className="w-40 h-40 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft-hover">
                         <span className="text-6xl">🛍️</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">Tủ đồ trống huơ trống hoác!</h3>
                    <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                        Chưa có món nào để khoe cả. Nạp đạn nhan sắc vào ngay đi nào!
                    </p>
                    <Link href="/wardrobe/add">
                        <Button size="lg" className="rounded-full text-lg h-14 px-8 shadow-soft hover:shadow-soft-hover font-bold">
                            Thêm món đầu tiên
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
                                   <div className="flex items-center justify-center h-full text-muted-foreground/30 text-2xl">📷</div>
                               )}
                               <div className="absolute top-2 right-2 flex gap-1">
                                    {item.season?.map((s: string) => (
                                        <span key={s} className="bg-white/80 backdrop-blur-md text-[10px] px-1.5 py-0.5 rounded-full text-foreground/70 font-medium border border-white/20">
                                            {s[0]}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-0.5 px-1">
                                <h3 className="font-semibold text-sm truncate text-foreground/90">{item.name}</h3>
                                <div className="flex justify-between items-center text-xs text-muted-foreground/80">
                                    <span className="capitalize">{item.brand || item.type}</span>
                                    <span className="text-muted-foreground/50">{item.color}</span>
                                </div>
                            </div>
                            
                            <form action={async () => {
                                   'use server'
                                   await deleteClothingItem(item.id)
                               }} className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <Button variant="ghost" size="icon-sm" className="h-8 w-8 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-destructive hover:text-white transition-colors">
                                       <Trash2 className="w-4 h-4" />
                                   </Button>
                            </form>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
