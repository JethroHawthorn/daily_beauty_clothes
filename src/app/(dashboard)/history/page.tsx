import { getHistory } from '@/app/actions/history'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'

export default async function HistoryPage() {
    const history = await getHistory()

    return (
        <div className="container mx-auto p-4 max-w-2xl pb-20">
            <div className="mb-6 flex items-center justify-between">
                <Link href="/" className="flex items-center text-sm font-medium hover:underline">
                    <ArrowLeft className="w-5 h-5 mr-1" /> Trang chủ
                </Link>
                <h1 className="text-2xl font-bold">Lịch sử mặc đồ</h1>
            </div>

            <div className="space-y-4">
                {history.map(item => (
                    <Card key={item.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="bg-gray-50 dark:bg-zinc-900 py-3 px-4 border-b">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center font-semibold text-sm">
                                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                    {new Date(item.date).toLocaleDateString("vi-VN", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                </div>
                                <span className="text-xs bg-white dark:bg-black border px-2 py-1 rounded-full text-gray-600 dark:text-gray-400">
                                    {item.purpose}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                             {/* Combo Items */}
                             <div className="mb-3">
                                <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Bộ đồ</h4>
                                <div className="flex flex-wrap gap-2">
                                    {item.combo.items.map((c: string, i: number) => (
                                        <span key={i} className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm px-3 py-1 rounded-full border border-purple-100 dark:border-purple-800">
                                            {c}
                                        </span>
                                    ))}
                                </div>
                             </div>
                             
                             {/* Weather Snapshot */}
                             {item.weather && (
                                 <div className="text-xs text-gray-400 mt-2 flex items-center gap-2">
                                     <span>{item.weather.condition}</span> • <span>{item.weather.temp}°C</span>
                                 </div>
                             )}
                        </CardContent>
                    </Card>
                ))}
            </div>

             {history.length === 0 && (
                <div className="text-center py-16 px-4">
                    <div className="bg-gray-100 dark:bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🕰️</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Chưa có lịch sử</h3>
                    <p className="text-gray-500 text-sm">Hãy nhận gợi ý từ AI và chọn "Mặc bộ này" để lưu vào lịch sử.</p>
                </div>
            )}
        </div>
    )
}
