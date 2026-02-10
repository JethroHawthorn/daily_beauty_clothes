'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, undefined)
  const router = useRouter()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((state as any)?.success && (state as any)?.user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = (state as any).user
      localStorage.setItem('user', JSON.stringify(user))
      router.push('/')
    }
  }, [state, router])

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-rose shadow-soft mb-6 text-4xl animate-in zoom-in spin-in-3 duration-700">
            🌸
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Hế lô cưng! 👋</h1>
          <p className="text-muted-foreground text-lg">
            Trợ lý ảo xinh đẹp đang chờ lệnh nè.
          </p>
        </div>

        <form action={action} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="sr-only">Số điện thoại</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="Nhập số điện thoại để 'alo' nào..."
              required
              className="h-14 text-lg bg-white/50 border-0 border-b-2 border-primary/20 rounded-none px-4 focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/50 transition-colors"
            />
            {state?.errors?.phoneNumber && (
              <p className="text-sm text-destructive font-medium">{state.errors.phoneNumber}</p>
            )}
          </div>

          <Button className="w-full h-14 text-lg font-semibold rounded-full shadow-soft hover:shadow-soft-hover transition-all bg-foreground text-background hover:bg-foreground/90" disabled={isPending}>
            {isPending ? 'Đang vào...' : 'Triển luôn! 🚀'}
          </Button>

          <p className="text-center text-sm text-muted-foreground/60">
            Tiếp tục là đồng ý với điều khoản dễ thương của chúng tớ.
          </p>
        </form>
      </div>
    </div>
  )
}
