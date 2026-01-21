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

    // Smart Pre-select Logic
    const today = new Date().getDay();
    const isWeekend = today === 0 || today === 6;
    const defaultPurpose = isWeekend ? "Đi cháy phố" : "Đi làm kiếm cơm";

    // Helper to trigger save
    const handleSave = async () => {
        if (!state?.suggestion || !state?.purpose) return
        setSaving(true)
        await saveToHistory(state.suggestion, state.weather, state.purpose)
    }

    return (
        <div className="container mx-auto p-4 max-w-lg pb-24">
             <div className="mb-6">
                 <Link href="/">
                    <Button variant="ghost" size="sm" className="-ml-3 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-5 h-5 mr-1" /> Trang chủ
                    </Button>
                 </Link>
             </div>
             
             {!state?.success && (
                <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-100 shadow-sm mb-2">
                            <span className="text-3xl">✨</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Thần thái đại nhân</h1>
                        <p className="text-muted-foreground text-sm">Đi đâu mà vội mà vàng? Hỏi tui cái đã!</p>
                    </div>

                    <form action={action} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <Label htmlFor="purpose" className="sr-only">Mục đích</Label>
                                <Input 
                                    name="purpose" 
                                    list="purposes" 
                                    defaultValue={defaultPurpose}
                                    placeholder="Đi quẩy, Hẹn hò, Đi làm..." 
                                    required 
                                    className="h-14 text-base px-6 rounded-2xl shadow-sm border-input bg-white focus-visible:ring-2 focus-visible:ring-primary/20" 
                                />
                                <datalist id="purposes">
                                    <option value="Đi làm kiếm cơm" />
                                    <option value="Đi cháy phố" />
                                    <option value="Hẹn hò lãng mạn" />
                                    <option value="Ăn đám cưới người yêu cũ" />
                                    <option value="Trà chiều chanh sả" />
                                    <option value="Về quê nuôi cá" />
                                </datalist>
                            </div>
                        </div>

                        <Button className="w-full h-12 text-base rounded-full shadow-soft hover:shadow-soft-hover bg-primary hover:bg-primary/90 text-primary-foreground font-bold" disabled={isPending}>
                            {isPending ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang vận nội công...</> : 'Biến hình! 🧚‍♀️'}
                        </Button>
                        {state?.error && <p className="text-destructive text-center text-sm font-medium bg-destructive/10 p-3 rounded-lg">{state.error}</p>}
                    </form>
                </div>
             )}

             {state?.success && state.suggestion && (
                 <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
                     <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-border/50 relative overflow-hidden">
                         
                         <div className="flex justify-between items-start mb-6 mt-2">
                             <div>
                                 <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded-md inline-block mb-2">Outfit of the day</p>
                                 <h2 className="text-2xl font-bold text-foreground capitalize">{state.purpose}</h2>
                             </div>
                             <div className="text-right">
                                 <p className="text-3xl font-bold text-foreground/80">{state.weather.temp}°</p>
                                 <p className="text-xs text-muted-foreground">{state.weather.condition}</p>
                             </div>
                         </div>

                         <div className="space-y-4 mb-8">
                             {state.suggestion.items.map((item: string, idx: number) => (
                                 <div key={idx} className="flex items-center gap-4 group">
                                     <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-foreground font-bold shadow-sm text-sm">
                                         {idx + 1}
                                     </div>
                                     <span className="text-lg font-medium text-foreground/90 pb-1 border-b border-dashed border-muted-foreground/30 flex-grow">{item}</span>
                                 </div>
                             ))}
                         </div>

                         <div className="bg-muted/30 p-5 rounded-xl relative">
                             <div className="absolute -top-3 -left-2 text-4xl opacity-10">❝</div>
                             <p className="text-foreground/80 italic leading-relaxed relative z-10 text-sm">
                                 {state.suggestion.reason}
                             </p>
                         </div>
                     </div>

                     <div className="flex flex-col gap-3">
                         <Button className="w-full h-14 rounded-full shadow-soft hover:shadow-soft-hover bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg" onClick={handleSave} disabled={saving}>
                             {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : '✅ Mình sẽ mặc bộ này'}
                         </Button>
                         <Button variant="ghost" className="w-full h-12 rounded-full font-medium text-muted-foreground hover:text-foreground" onClick={() => window.location.reload()}>
                             Gợi ý khác ↻
                         </Button>
                     </div>
                 </div>
             )}
        </div>
    )
}
