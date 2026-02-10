'use server'

import { db } from '@/lib/db'
import { clothingItems } from '@/db/schema'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'
import { eq, desc, and, sql } from 'drizzle-orm'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addClothingItem(prevState: any, formData: FormData) {
  const userId = formData.get('userId') as string
  if (!userId) return { errors: { _form: "Bạn chưa đăng nhập" } }

  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const fit = formData.get('fit') as string
  const color = formData.get('color') as string
  const material = formData.get('material') as string
  const seasons = formData.getAll('season') as string[]
  const imageFile = formData.get('image') as File

  // Image upload removed
  const imageUrl = ''

  try {
     await db.insert(clothingItems).values({
        id: randomUUID(),
        userId,
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

export async function getClothingItems(userId: string, filters?: WardrobeFilters) {
    if (!userId) return []
    
    try {
      const conditions = [eq(clothingItems.userId, userId)]
      
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

export async function deleteClothingItem(id: string, userId: string) {
    if (!userId) return

    // Ensure user owns the item
    await db.delete(clothingItems).where(
        and(
            eq(clothingItems.id, id),
            eq(clothingItems.userId, userId)
        )
    )
    revalidatePath('/wardrobe')
}

export async function toggleFavorite(id: string, isFavorite: boolean, userId: string) {
    if (!userId) return
    
    await db.update(clothingItems)
        .set({ isFavorite: isFavorite })
        .where(
            and(
                eq(clothingItems.id, id),
                eq(clothingItems.userId, userId)
            )
        )
    revalidatePath('/wardrobe')
}

export async function getClothingItem(id: string, userId: string) {
    if (!userId) return null

    const item = await db.query.clothingItems.findFirst({
        where: and(
            eq(clothingItems.id, id),
            eq(clothingItems.userId, userId)
        )
    })
    return item
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateClothingItem(id: string, prevState: any, formData: FormData) {
    const userId = formData.get('userId') as string
    if (!userId) return { errors: { _form: "Bạn chưa đăng nhập" } }

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const fit = formData.get('fit') as string
    const color = formData.get('color') as string
    const material = formData.get('material') as string
    const seasons = formData.getAll('season') as string[]
    const imageFile = formData.get('image') as File

  // Image upload removed
  const imageUrl = undefined

    try {
        await db.update(clothingItems).set({
            name,
            type,
            fit,
            color,
            material,
            season: seasons,
            // imageUrl removed
        }).where(
            and(
                eq(clothingItems.id, id),
                eq(clothingItems.userId, userId)
            )
        )
        revalidatePath('/wardrobe')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { errors: { _form: "Cập nhật thất bại" } }
    }
}
