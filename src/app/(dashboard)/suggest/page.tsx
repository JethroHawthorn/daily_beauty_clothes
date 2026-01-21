'use client'

import { useActionState, useState } from 'react'
import { generateOutfit, saveToHistory } from '@/app/actions/ai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Loader2, ArrowLeft, Shirt } from 'lucide-react'
import Link from 'next/link'

export default function SuggestPage() {
    const [state, action, isPending] = useActionState(generateOutfit, undefined)
    const [saving, setSaving] = useState(false)

    // Helper to trigger save
    const handleSave = async () => {
        if (!state?.suggestion || !state?.purpose) return
        setSaving(true)
        await saveToHistory(state.suggestion, state.weather, state.purpose)
    }

    return (
        <div className="container mx-auto p-4 max-w-lg">
             <div className="mb-4">
                 <Link href="/" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Trang chủ
                 </Link>
             </div>
             
             {!state?.success && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                             <span className="bg-orange-100 p-2 rounded-lg text-xl">✨</span>
                             Gợi ý phối đồ
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={action} className="space-y-4">
                            <div>
                                <Label htmlFor="purpose">Mục đích mặc là gì?</Label>
                                <Input name="purpose" list="purposes" placeholder="Ví dụ: Đi làm, Đi chơi, Hẹn hò" required className="mt-1" />
                                <datalist id="purposes">
                                    <option value="Đi làm" />
                                    <option value="Đi chơi dạo phố" />
                                    <option value="Hẹn hò" />
                                    <option value="Dự tiệc cưới" />
                                    <option value="Tiệc tùng" />
                                    <option value="Du lịch" />
                                </datalist>
                                <p className="text-xs text-gray-500 mt-2">
                                    Chúng tôi sẽ phân tích thời tiết (28°C, Có mây) và tủ đồ của bạn.
                                </p>
                            </div>
                            <Button className="w-full" disabled={isPending}>
                                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang phối đồ...</> : 'Hỏi AI Stylist'}
                            </Button>
                            {state?.error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{state.error}</p>}
                        </form>
                    </CardContent>
                </Card>
             )}

             {state?.success && state.suggestion && (
                 <Card className="border-2 border-purple-200 shadow-md">
                     <CardHeader className="bg-purple-50 dark:bg-zinc-900 border-b pb-4">
                         <CardTitle className="text-purple-700 dark:text-purple-400 text-lg">Trang phục gợi ý</CardTitle>
                         <div className="flex justify-between text-sm text-gray-600 mt-1">
                            <span>Mục đích: {state.purpose}</span>
                            <span>Nhiệt độ: {state.weather.temp}°C</span>
                         </div>
                     </CardHeader>
                     <CardContent className="pt-6 space-y-6">
                         <div>
                             <h4 className="font-semibold mb-3 flex items-center gap-2"><Shirt className="w-4 h-4"/> Bộ đồ</h4>
                             <ul className="space-y-2">
                                 {state.suggestion.items.map((item: string, idx: number) => (
                                     <li key={idx} className="flex items-center gap-2 bg-white dark:bg-black border p-3 rounded-lg shadow-sm">
                                         <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">{idx + 1}</span>
                                         <span className="font-medium">{item}</span>
                                     </li>
                                 ))}
                             </ul>
                         </div>
                         <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-sm text-yellow-800 dark:text-yellow-200 border border-yellow-100 dark:border-yellow-900/30">
                             <strong>Tại sao chọn bộ này:</strong> <span className="italic">{state.suggestion.reason}</span>
                         </div>
                     </CardContent>
                     <CardFooter className="flex gap-3 pt-2">
                         <Button variant="outline" className="flex-1" onClick={() => window.location.reload()}>Thử lại</Button>
                         <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={handleSave} disabled={saving}>
                             {saving ? 'Đang lưu...' : 'Mặc bộ này!'}
                         </Button>
                     </CardFooter>
                 </Card>
             )}
        </div>
    )
}
