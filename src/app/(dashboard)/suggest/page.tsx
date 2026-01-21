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
                <Card className="shadow-soft">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                             <span className="bg-accent-light p-2 rounded-lg text-xl">✨</span>
                             Gợi ý phối đồ
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={action} className="space-y-4">
                            <div>
                                <Label htmlFor="purpose" className="mb-2 block">Mục đích mặc là gì?</Label>
                                <Input name="purpose" list="purposes" placeholder="Ví dụ: Đi làm, Đi chơi, Hẹn hò" required className="mt-1" />
                                <datalist id="purposes">
                                    <option value="Đi làm" />
                                    <option value="Đi chơi dạo phố" />
                                    <option value="Hẹn hò" />
                                    <option value="Dự tiệc cưới" />
                                    <option value="Tiệc tùng" />
                                    <option value="Du lịch" />
                                </datalist>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Chúng tôi sẽ phân tích thời tiết và tủ đồ của bạn.
                                </p>
                            </div>
                            <Button className="w-full" disabled={isPending}>
                                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang phối đồ...</> : 'Hỏi AI Stylist'}
                            </Button>
                            {state?.error && <p className="text-destructive text-sm bg-red-50 p-2 rounded">{state.error}</p>}
                        </form>
                    </CardContent>
                </Card>
             )}

             {state?.success && state.suggestion && (
                 <Card className="border-2 border-primary shadow-soft">
                     <CardHeader className="bg-primary-light border-b pb-4">
                         <CardTitle className="text-primary-foreground text-lg">Trang phục gợi ý</CardTitle>
                         <div className="flex justify-between text-sm text-foreground/80 mt-1">
                            <span>Mục đích: {state.purpose}</span>
                            <span>Nhiệt độ: {state.weather.temp}°C</span>
                         </div>
                     </CardHeader>
                     <CardContent className="pt-6 space-y-6">
                         <div>
                             <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground"><Shirt className="w-4 h-4"/> Bộ đồ</h4>
                             <ul className="space-y-2">
                                 {state.suggestion.items.map((item: string, idx: number) => (
                                     <li key={idx} className="flex items-center gap-2 bg-card border p-3 rounded-lg shadow-sm">
                                         <span className="w-6 h-6 rounded-full bg-secondary-light flex items-center justify-center text-xs text-foreground font-medium">{idx + 1}</span>
                                         <span className="font-medium">{item}</span>
                                     </li>
                                 ))}
                             </ul>
                         </div>
                         <div className="bg-accent-light p-4 rounded-lg text-sm text-foreground border border-accent/20">
                             <strong>Tại sao chọn bộ này:</strong> <span className="italic">{state.suggestion.reason}</span>
                         </div>
                     </CardContent>
                     <CardFooter className="flex gap-3 pt-2">
                         <Button variant="outline" className="flex-1" onClick={() => window.location.reload()}>Thử lại</Button>
                         <Button className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground" onClick={handleSave} disabled={saving}>
                             {saving ? 'Đang lưu...' : 'Mặc bộ này!'}
                         </Button>
                     </CardFooter>
                 </Card>
             )}
        </div>
    )
}
