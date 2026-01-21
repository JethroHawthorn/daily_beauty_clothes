import { getHistory } from '@/app/actions/history'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, CalendarHeart, Calendar, History, Cloud, CloudSun, Sun } from 'lucide-react'


export default async function HistoryPage() {
    const history = await getHistory()

    // Group history by date string
    const groupedHistory = history.reduce((groups, item) => {
        const date = new Date(item.date).toLocaleDateString("vi-VN", { weekday: 'short', day: 'numeric', month: 'long' });
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(item);
        return groups;
    }, {} as Record<string, typeof history>);

    return (
        <div className="container mx-auto p-4 max-w-lg pb-24">
            <div className="mb-6">
                 <Link href="/">
                    <Button variant="ghost" size="sm" className="-ml-3 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-5 h-5 mr-1" /> Trang chủ
                    </Button>
                 </Link>
            </div>
            
            <div className="mb-8 flex items-center justify-between">
                <div className='flex items-center gap-2'>
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                        <CalendarHeart className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Hành trình nhan sắc</h1>
                </div>
            </div>

            <div className="space-y-8 relative">
                {/* Vertical Timeline Line */}
                {history.length > 0 && (
                    <div className="absolute left-[19px] top-2 bottom-0 w-0.5 bg-border -z-10 bg-gradient-to-b from-primary/50 to-transparent"></div>
                )}

                {Object.entries(groupedHistory).map(([date, items]) => (
                    <div key={date} className="relative">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-primary/20 shadow-sm z-10 text-primary">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <h2 className="ml-4 font-semibold text-foreground/80 capitalize">{date}</h2>
                        </div>
                        
                        <div className="ml-12 space-y-4">
                            {items.map(item => (
                                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-soft border border-muted/40 hover:shadow-soft-hover transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-light text-foreground/80">
                                            {item.purpose}
                                        </span>
                                        {item.weather && (
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <span>{item.weather.temp}°</span>
                                                <span className="mx-1">•</span>
                                                <span>{item.weather.condition}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap gap-2 text-sm text-foreground/90 font-medium">
                                            {item.combo.items.map((c: string, i: number) => (
                                                <span key={i} className="flex items-center">
                                                    {i > 0 && <span className="mx-2 text-muted-foreground/30">•</span>}
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                        {item.combo.reason && (
                                            <p className="text-xs text-muted-foreground italic mt-2 line-clamp-2">
                                                "{item.combo.reason}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

             {history.length === 0 && (
                <div className="text-center py-20 px-4 animate-in fade-in duration-500">
                     <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
                        <History className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-muted-foreground">Sổ tay chưa có gì cả</h3>
                    <p className="text-muted-foreground/70 text-sm max-w-xs mx-auto mb-8">
                        Thêm vài món đồ để mình gợi ý cho bạn nhé 💗
                    </p>
                    <Link href="/wardrobe/add" className="inline-block">
                        <Button className="rounded-full shadow-soft font-bold px-8">Thêm món đầu tiên</Button>
                    </Link>
                </div>
            )}
            
            {/* Emotional Closure Footer */}
            {history.length > 0 && (
                <div className="text-center pt-8 pb-4 mt-6 border-t border-border/30">
                    <p className="text-sm text-muted-foreground/70">
                        Hy vọng hôm nay bạn cảm thấy tự tin hơn một chút. 💗
                    </p>
                </div>
            )}
        </div>
    )
}
