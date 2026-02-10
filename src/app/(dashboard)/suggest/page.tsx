'use client'

import { useActionState, useState } from 'react'
import { generateOutfit, saveToHistory } from '@/app/actions/ai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OutfitPreviewSkeleton } from '@/components/outfit-preview-skeleton'


import { Loader2, ArrowLeft, Sparkles, Quote, Heart } from 'lucide-react'
import Link from 'next/link'

import { useUser } from '@/hooks/use-user'

const CLOSING_MESSAGES = [
  "Chúc bạn có một ngày dễ thương nhé 💗",
  "Hy vọng hôm nay bạn cảm thấy tự tin hơn một chút.",
  "Tự tin lên nào, bạn đẹp lắm rồi! ✨",
  "Chúc bạn tỏa sáng hôm nay nhé 💫",
]

export default function SuggestPage() {
  const [state, action, isPending] = useActionState(generateOutfit, undefined)
  const [saving, setSaving] = useState(false)
  const [showClosingMessage, setShowClosingMessage] = useState(false)
  const [closingMessage, setClosingMessage] = useState("")
  const { user } = useUser(true)

  // Smart Pre-select Logic
  const today = new Date().getDay();
  const isWeekend = today === 0 || today === 6;
  const defaultPurpose = isWeekend ? "Đi cháy phố" : "Đi làm kiếm cơm";

  // Helper to trigger save with emotional closure
  const handleSave = async () => {
    if (!state?.suggestion || !state?.purpose || !user) return
    setSaving(true)
    setClosingMessage(CLOSING_MESSAGES[Math.floor(Math.random() * CLOSING_MESSAGES.length)])
    setShowClosingMessage(true)
    // Brief delay to show the message before redirect
    setTimeout(async () => {
      await saveToHistory(state.suggestion, state.weather, state.purpose, user.id)
    }, 1500)
  }

  if (!user) return null // or loading spinner, useUser handles redirect

  return (
    <div className="container mx-auto p-4 max-w-lg pb-24">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="-ml-3 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5 mr-1" /> Trang chủ
          </Button>
        </Link>
      </div>

      {/* LOADING STATE - SKELETON UI */}
      {isPending && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-100 flex items-center justify-center animate-pulse">
                <Sparkles className="w-10 h-10 text-rose-300" />
              </div>
              <div className="absolute inset-0 rounded-full border-t-2 border-rose-400 animate-spin"></div>
            </div>
            <p className="text-center font-medium text-foreground/80 animate-pulse">
              Đang chọn đồ phù hợp với thời tiết hôm nay cho bạn...
            </p>
          </div>
          {/* Fake Skeleton Card */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-border/50 space-y-4 opacity-50 pointer-events-none">
            <div className="h-8 bg-muted/50 rounded-md w-3/4"></div>
            <div className="space-y-3 pt-4">
              <div className="h-6 bg-muted/30 rounded-md w-full"></div>
              <div className="h-6 bg-muted/30 rounded-md w-5/6"></div>
              <div className="h-6 bg-muted/30 rounded-md w-4/6"></div>
            </div>
          </div>
        </div>
      )}

      {/* FORM STATE (Only show when not loading and not success) */}
      {!isPending && !state?.success && (
        <div className="space-y-8 animate-in fade-in duration-700">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-100 shadow-sm mb-2 text-rose-500">
              <Sparkles className="w-10 h-10" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Hôm nay mặc gì?</h1>
            <p className="text-muted-foreground text-sm px-4">Hãy chọn phong cách bạn muốn cho ngày hôm nay ✨</p>
          </div>

          <form action={action} className="space-y-6">
            <input type="hidden" name="userId" value={user?.id || ''} />
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="purpose" className="sr-only">Dịp / Hoàn cảnh</Label>
                <Input
                  name="purpose"
                  list="purposes"
                  defaultValue={defaultPurpose}
                  placeholder="Đi quẩy, Hẹn hò, Đi làm..."
                  required
                  className="h-14 text-base px-6 rounded-2xl shadow-sm border-input bg-white focus-visible:ring-2 focus-visible:ring-primary/20"
                />
                <datalist id="purposes">
                  <option value="Đi làm" />
                  <option value="Dạo phố" />
                  <option value="Hẹn hò" />
                  <option value="Dự tiệc / Đám cưới" />
                  <option value="Cafe / Trà chiều" />
                  <option value="Du lịch / Dã ngoại" />
                </datalist>
              </div>
            </div>

            <Button className="w-full h-14 text-lg rounded-full shadow-soft hover:shadow-soft-hover bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all hover:scale-[1.02]" disabled={isPending}>
              Gợi ý phối đồ 🧚‍♀️
            </Button>
            {state?.error && <p className="text-destructive text-center text-sm font-medium bg-destructive/10 p-3 rounded-lg">{state.error}</p>}
          </form>
        </div>
      )}

      {/* RESULT STATE */}
      {!isPending && state?.success && state.suggestion && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">

          <div className="flex justify-center -mb-4 relative z-10">
            <OutfitPreviewSkeleton outfit={state.suggestion.outfit} />
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-border/50 relative overflow-hidden pt-12">


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
              <div className="absolute -top-2 -left-2 text-muted-foreground/20">
                <Quote className="w-6 h-6 rotate-180" strokeWidth={1.5} />
              </div>
              <p className="text-foreground/80 italic leading-relaxed relative z-10 text-sm px-2">
                {state.suggestion.reason}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {showClosingMessage ? (
              <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
                <Heart className="w-12 h-12 text-rose-400 mx-auto mb-4 animate-pulse" strokeWidth={1.5} />
                <p className="text-lg font-medium text-foreground/90">
                  {closingMessage}
                </p>
              </div>
            ) : (
              <>
                <Button className="w-full h-14 rounded-full shadow-soft hover:shadow-soft-hover bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg transition-transform active:scale-95" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : '❤️ Chọn bộ này'}
                </Button>
                <Button variant="ghost" className="w-full h-12 rounded-full font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50" onClick={() => window.location.reload()}>
                  Gợi ý khác ↻
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
