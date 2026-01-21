'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, undefined)

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập số điện thoại để đăng nhập hoặc tạo tài khoản.
          </CardDescription>
        </CardHeader>
        <form action={action}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="0912345678"
                required
              />
              {state?.errors?.phoneNumber && (
                <p className="text-sm text-red-500">{state.errors.phoneNumber}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={isPending}>
              {isPending ? 'Đang đăng nhập...' : 'Tiếp tục'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
