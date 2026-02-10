'use server'

import { db } from '@/lib/db'
import { clothingItems } from '@/db/schema'
import { verifySession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'
import { eq, desc, and, sql } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import fs from 'fs'
import path from 'path'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addClothingItem(prevState: any, formData: FormData) {
  const session = await verifySession()
  if (!session) redirect('/login')

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const fit = formData.get('fit') as string
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
        fit,
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

export type WardrobeFilters = {
    search?: string
    type?: string
    season?: string
    isFavorite?: boolean
}

export async function getClothingItems(filters?: WardrobeFilters) {
    const session = await verifySession()
    if (!session) return []
    
    try {
      const conditions = [eq(clothingItems.userId, session.userId)]
      
      if (filters?.search) {
          conditions.push(sql`lower(${clothingItems.name}) LIKE ${`%${filters.search.toLowerCase()}%`}`)
      }
      
      if (filters?.type && filters.type !== 'all') {
          conditions.push(eq(clothingItems.type, filters.type))
      }

      if (filters?.isFavorite) {
          conditions.push(eq(clothingItems.isFavorite, true))
      }

      // Hacky JSON array filtering for SQLite
      if (filters?.season && filters.season !== 'all') {
           conditions.push(sql`${clothingItems.season} LIKE ${`%${filters.season}%`}`)
      }

      const items = await db.query.clothingItems.findMany({
          where: and(...conditions),
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

export async function toggleFavorite(id: string, isFavorite: boolean) {
    const session = await verifySession()
    if (!session) redirect('/login')
    
    await db.update(clothingItems)
        .set({ isFavorite: isFavorite })
        .where(
            and(
                eq(clothingItems.id, id),
                eq(clothingItems.userId, session.userId)
            )
        )
    revalidatePath('/wardrobe')
}

export async function getClothingItem(id: string) {
    const session = await verifySession()
    if (!session) return null

    const item = await db.query.clothingItems.findFirst({
        where: and(
            eq(clothingItems.id, id),
            eq(clothingItems.userId, session.userId)
        )
    })
    return item
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateClothingItem(id: string, prevState: any, formData: FormData) {
    const session = await verifySession()
    if (!session) redirect('/login')

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const fit = formData.get('fit') as string
    const color = formData.get('color') as string
    const material = formData.get('material') as string
    const seasons = formData.getAll('season') as string[]
    const imageFile = formData.get('image') as File

    let imageUrl = undefined // undefined means don't update
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
        await db.update(clothingItems).set({
            name,
            type,
            fit,
            color,
            material,
            season: seasons,
            ...(imageUrl && { imageUrl }), // Only update if new image uploaded
        }).where(
            and(
                eq(clothingItems.id, id),
                eq(clothingItems.userId, session.userId)
            )
        )
        revalidatePath('/wardrobe')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { errors: { _form: "Cập nhật thất bại" } }
    }
}
