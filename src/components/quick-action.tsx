'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { quickSuggest, saveToHistory } from '@/app/actions/ai'
import { Sparkles, Loader2, Check } from 'lucide-react'
import { OutfitCanvasRenderer } from '@/components/outfit-canvas-renderer'

import { useUser } from '@/hooks/use-user'

export function QuickAction() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useUser(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null)

  const handleQuickAction = async () => {
    if (!user) {
      // Redirect to login if not available? or just alert?
      // Since we are on client, we can likely rely on useUser internal check or router push
      window.location.href = '/login'
      return
    }
    setIsOpen(true)
    setIsLoading(true)
    setResult(null)

    const response = await quickSuggest(user.id);

    if (response.success) {
      setResult(response)
    } else {
      // Handle error (maybe show toast, but for now just show text)
      setResult({ error: response.error })
    }
    setIsLoading(false)
  }

  const handleSave = async () => {
    if (result && result.success && user) {
      await saveToHistory(result.suggestion, result.weather, result.purpose, user.id)
    }
  }

  return (
    <>
      <Button
        onClick={handleQuickAction}
        className="w-full h-16 text-lg font-bold rounded-2xl shadow-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white animate-in zoom-in duration-300"
      >
        <Sparkles className="mr-2 h-6 w-6 animate-pulse" />
        Hôm nay mặc gì?
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gợi ý từ AI Stylist</DialogTitle>
            <DialogDescription>
              Dựa trên thời tiết hôm nay và tủ đồ của bạn
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-pink-200 blur-xl rounded-full opacity-50 animate-pulse"></div>
                <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
              </div>
              <p className="text-sm text-muted-foreground animate-pulse">Đang lục lọi tủ đồ...</p>
            </div>
          ) : result?.error ? (
            <div className="py-6 text-center text-destructive">
              <p>{result.error}</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="bg-secondary/20 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-foreground">Combo đề xuất:</h3>
                  <span className="text-xs bg-white/50 px-2 py-1 rounded-full text-muted-foreground">
                    {result.weather.temp}°C - {result.purpose}
                  </span>
                </div>

                {/* Outfit Visual */}
                {result.suggestion.outfit && (
                  <div className="mb-4">
                    <OutfitCanvasRenderer outfit={result.suggestion.outfit} className="w-full max-w-[200px] mx-auto" />
                  </div>
                )}

                <ul className="list-disc list-inside space-y-1 ml-1 text-sm">
                  {result.suggestion.items.map((item: string, i: number) => (
                    <li key={i} className="text-foreground/90">{item}</li>
                  ))}
                </ul>
                <div className="mt-3 pt-3 border-t border-dashed border-foreground/10">
                  <p className="text-sm italic text-muted-foreground">
                    &quot;{result.suggestion.reason}&quot;
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave} className="w-full rounded-full font-semibold" size="lg">
                  <Check className="mr-2 h-4 w-4" />
                  Chốt đơn! (Lưu lịch sử)
                </Button>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
