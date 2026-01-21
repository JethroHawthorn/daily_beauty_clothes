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
        <div className="container mx-auto p-4 max-w-lg pb-24">
             <div className="mb-8 items-center justify-between hidden md:flex">
                 <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-1" /> Trang chủ
                 </Link>
             </div>
             
             {!state?.success && (
                <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-rose shadow-soft mb-4">
                            <span className="text-4xl">✨</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Thần thái đại nhân</h1>
                        <p className="text-muted-foreground">Đi đâu mà vội mà vàng? Hỏi tui cái đã!</p>
                    </div>

                    <form action={action} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <Label htmlFor="purpose" className="sr-only">Mục đích</Label>
                                <Input 
                                    name="purpose" 
                                    list="purposes" 
                                    placeholder="Đi quẩy, Hẹn hò, Đi làm..." 
                                    required 
                                    className="h-16 text-lg px-6 rounded-full shadow-soft border-transparent bg-white focus-visible:ring-2 focus-visible:ring-primary/20" 
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

                        <Button className="w-full h-14 text-lg rounded-full shadow-soft hover:shadow-soft-hover bg-primary hover:bg-primary/90 text-primary-foreground font-bold" disabled={isPending}>
                            {isPending ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang vận nội công...</> : 'Biến hình! 🧚‍♀️'}
                        </Button>
                        {state?.error && <p className="text-destructive text-center text-sm font-medium bg-destructive/10 p-3 rounded-lg">{state.error}</p>}
                    </form>
                </div>
             )}

             {state?.success && state.suggestion && (
                 <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
                     <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-primary/10 relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-rose"></div>
                         
                         <div className="flex justify-between items-start mb-6 mt-2">
                             <div>
                                 <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Outfit of the day</p>
                                 <h2 className="text-2xl font-bold text-foreground mt-1 capitalize">{state.purpose}</h2>
                             </div>
                             <div className="text-right">
                                 <p className="text-3xl font-bold text-primary">{state.weather.temp}°</p>
                                 <p className="text-xs text-muted-foreground">{state.weather.condition}</p>
                             </div>
                         </div>

                         <div className="space-y-4 mb-8">
                             {state.suggestion.items.map((item: string, idx: number) => (
                                 <div key={idx} className="flex items-center gap-4 group">
                                     <div className="w-10 h-10 rounded-full bg-secondary-light flex items-center justify-center text-foreground font-bold shadow-sm group-hover:scale-110 transition-transform">
                                         {idx + 1}
                                     </div>
                                     <span className="text-lg font-medium text-foreground/90 pb-1 border-b border-dashed border-muted-foreground/30 flex-grow">{item}</span>
                                 </div>
                             ))}
                         </div>

                         <div className="bg-accent-light/50 p-6 rounded-2xl relative">
                             <div className="absolute -top-3 -left-2 text-4xl opacity-20">❝</div>
                             <p className="text-foreground/80 italic leading-relaxed relative z-10">
                                 {state.suggestion.reason}
                             </p>
                             <div className="absolute -bottom-4 -right-2 text-4xl opacity-20">❞</div>
                         </div>
                     </div>

                     <div className="flex gap-4">
                         <Button variant="outline" className="flex-1 h-14 rounded-full border-2 hover:bg-muted font-semibold" onClick={() => window.location.reload()}>
                             Làm lại
                         </Button>
                         <Button className="flex-[2] h-14 rounded-full shadow-soft hover:shadow-soft-hover bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg" onClick={handleSave} disabled={saving}>
                             {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : '💖 Chốt đơn!'}
                         </Button>
                     </div>
                 </div>
             )}
        </div>
    )
}
