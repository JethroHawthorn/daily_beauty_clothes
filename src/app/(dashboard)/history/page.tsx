import { getHistory } from '@/app/actions/history'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'


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
            <div className="mb-8 flex items-center justify-between">
                <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-1" /> Trang chủ
                </Link>
                <h1 className="text-xl font-bold">Hành trình nhan sắc</h1>
                <div className="w-10"></div>
            </div>

            <div className="space-y-8 relative">
                {/* Vertical Timeline Line */}
                {history.length > 0 && (
                    <div className="absolute left-[19px] top-2 bottom-0 w-0.5 bg-border -z-10 bg-gradient-to-b from-primary/50 to-transparent"></div>
                )}

                {Object.entries(groupedHistory).map(([date, items]) => (
                    <div key={date} className="relative">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center border-4 border-background shadow-sm z-10">
                                <span className="text-lg">📅</span>
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
                        <span className="text-4xl grayscale">🕰️</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-muted-foreground">Chưa có gì để nhớ thương</h3>
                    <p className="text-muted-foreground/70 text-sm max-w-xs mx-auto">
                        Bắt đầu ngày mới bằng việc hỏi AI xem nay mặc gì cho xinh đi!
                    </p>
                    <Link href="/suggest" className="mt-8 inline-block">
                        <Button className="rounded-full shadow-soft font-bold">Hỏi Thần thái đại nhân</Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
