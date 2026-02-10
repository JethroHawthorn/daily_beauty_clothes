'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { createSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { randomUUID } from 'crypto'

const loginSchema = z.object({
  phoneNumber: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số'),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function login(prevState: any, formData: FormData) {
  const result = loginSchema.safeParse({
    phoneNumber: formData.get('phoneNumber'),
  })

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  const { phoneNumber } = result.data

  // Mock OTP verification logic would go here
  
  // Check if user exists
  let user = await db.query.users.findFirst({
    where: eq(users.phoneNumber, phoneNumber),
  })

  // If not, create new user
  if (!user) {
    const userId = randomUUID()
    await db.insert(users).values({
      id: userId,
      phoneNumber: phoneNumber,
    })
    // Fetch again to be sure date is correct or just construct object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user = { id: userId, phoneNumber, createdAt: new Date(), updatedAt: new Date() } as any
  }

  await createSession(user!.id)
  redirect('/')
}
