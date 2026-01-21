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
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm shadow-bloom">
        <CardHeader className="text-center pb-2">
          <div className="text-4xl mb-3 bg-primary-light p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">🌸</div>
          <CardTitle className="text-xl font-bold">Đăng nhập</CardTitle>
          <CardDescription className="text-sm">
            Nhập số điện thoại để đăng nhập hoặc tạo tài khoản.
          </CardDescription>
        </CardHeader>
        <form action={action}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="0912345678"
                required
                className="h-12"
              />
              {state?.errors?.phoneNumber && (
                <p className="text-sm text-destructive">{state.errors.phoneNumber}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button className="w-full h-12 font-medium" disabled={isPending}>
              {isPending ? 'Đang đăng nhập...' : 'Tiếp tục'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
