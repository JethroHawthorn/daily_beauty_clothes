'use server'

import { db } from '@/lib/db'
import { clothingItems } from '@/db/schema'
import { verifySession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'
import { eq, desc, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import fs from 'fs'
import path from 'path'

export async function addClothingItem(prevState: any, formData: FormData) {
  const session = await verifySession()
  if (!session) redirect('/login')

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const style = formData.get('style') as string
  const color = formData.get('color') as string
  const material = formData.get('material') as string
  const seasons = formData.getAll('season') as string[]
  const imageFile = formData.get('image') as File

  let imageUrl = ''
  if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
      }
      fs.writeFileSync(path.join(uploadDir, filename), buffer)
      imageUrl = `/uploads/${filename}`
  }

  try {
     await db.insert(clothingItems).values({
        id: randomUUID(),
        userId: session.userId,
        name,
        type,
        style,
        color,
        material,
        season: seasons,
        imageUrl,
     })
     revalidatePath('/wardrobe')
     return { success: true }
  } catch (e) {
      console.error(e)
      return { errors: { _form: "Thêm món đồ thất bại" } }
  }
}

export async function getClothingItems() {
    const session = await verifySession()
    if (!session) return []
    
    try {
      const items = await db.query.clothingItems.findMany({
          where: eq(clothingItems.userId, session.userId),
          orderBy: [desc(clothingItems.createdAt)]
      })
      return items
    } catch (e) {
      console.error("Error fetching clothing items:", e)
      return []
    }
}

export async function deleteClothingItem(id: string) {
    const session = await verifySession()
    if (!session) redirect('/login')
    
    // Ensure user owns the item
    await db.delete(clothingItems).where(
        and(
            eq(clothingItems.id, id),
            eq(clothingItems.userId, session.userId)
        )
    )
    revalidatePath('/wardrobe')
}
