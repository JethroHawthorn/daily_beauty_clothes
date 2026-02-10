import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export type User = {
    id: string
    phoneNumber: string
}

export function useUser(redirectToLogin = true) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const userStr = localStorage.getItem('user')
        if (!userStr) {
            if (redirectToLogin) {
                router.push('/login')
            } else {
                setIsLoading(false)
            }
            return
        }

        try {
            const parsed = JSON.parse(userStr)
            setUser(parsed)
        } catch {
            if (redirectToLogin) {
                router.push('/login')
            }
        } finally {
            setIsLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { user, isLoading }
}
