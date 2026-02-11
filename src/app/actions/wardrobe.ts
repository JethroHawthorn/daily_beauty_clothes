'use server'

import { db } from '@/lib/db'
import { clothingItems } from '@/db/schema'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { randomUUID } from 'crypto'
import { eq, desc, and, sql } from 'drizzle-orm'
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary'

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

  const submittedValues = {
    name,
    type,
    fit,
    color,
    material,
    season: seasons,
  }

  let imageUrl = ''
  if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
      try {
        const result = await uploadToCloudinary(imageFile)
        imageUrl = result.secure_url
      } catch (error) {
          console.error("Upload failed", error)
          return {
            errors: { _form: "Upload ảnh thất bại: " + (error instanceof Error ? error.message : "Lỗi không xác định") },
            values: submittedValues
          }
      }
  }

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
  } catch (e) {
      console.error(e)
      return {
        errors: { _form: "Thêm món đồ thất bại" },
        values: submittedValues
      }
  }
  revalidatePath('/wardrobe')
  redirect('/wardrobe')
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

    // Get item to find image url
    const item = await db.query.clothingItems.findFirst({
        where: and(
            eq(clothingItems.id, id),
            eq(clothingItems.userId, userId)
        )
    })

    if (!item) return

    // Delete image from Cloudinary if exists
    if (item.imageUrl) {
        try {
            // Extract public_id from secure_url (hacky but works for standard Cloudinary URLs)
            // URL: https://res.cloudinary.com/demo/image/upload/v1614015026/sample.jpg
            // Public ID: sample
            const publicId = item.imageUrl.split('/').pop()?.split('.')[0]
            if (publicId) {
                // We added folder 'daily-beauty-clothes' in upload, so we need to include it?
                // Actually the upload function result.public_id includes the folder.
                // But we don't save public_id in DB, only url.
                // We need to retrieve public_id or parse it from URL properly.
                // Cloudinary URL format: .../upload/v<version>/<folder>/<id>.<ext>
                // So we need to grab <folder>/<id>
                
                const parts = item.imageUrl.split('/');
                const uploadIndex = parts.indexOf('upload');
                if (uploadIndex !== -1 && parts.length > uploadIndex + 2) {
                     // parts after 'upload' and version 'v...'
                     // The version part usually starts with 'v', we can skip it.
                     let publicIdParts = parts.slice(uploadIndex + 1);
                     if (publicIdParts[0].startsWith('v')) {
                         publicIdParts = publicIdParts.slice(1);
                     }
                     // Join remaining parts and remove extension
                     const publicIdWithExt = publicIdParts.join('/');
                     const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
                     
                     await deleteFromCloudinary(publicId);
                }
            }
        } catch (e) {
            console.error("Failed to delete image from Cloudinary", e)
        }
    }

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

    const submittedValues = {
        name,
        type,
        fit,
        color,
        material,
        season: seasons,
    }

    let imageUrl = undefined // undefined means don't update
    if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
        try {
            // Delete old image if exists
            const currentItem = await db.query.clothingItems.findFirst({
                where: and(eq(clothingItems.id, id), eq(clothingItems.userId, userId))
            })
            
            if (currentItem?.imageUrl) {
                // Logic to extract public_id
                 const parts = currentItem.imageUrl.split('/');
                 const uploadIndex = parts.indexOf('upload');
                 if (uploadIndex !== -1 && parts.length > uploadIndex + 2) {
                      let publicIdParts = parts.slice(uploadIndex + 1);
                      if (publicIdParts[0].startsWith('v')) {
                          publicIdParts = publicIdParts.slice(1);
                      }
                      const publicIdWithExt = publicIdParts.join('/');
                      const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
                      await deleteFromCloudinary(publicId).catch(err => console.error("Failed to delete old image", err));
                 }
            }

            const result = await uploadToCloudinary(imageFile)
            imageUrl = result.secure_url
        } catch (error) {
            console.error("Upload failed", error)
            return {
                errors: { _form: "Upload ảnh thất bại" },
                values: submittedValues
            }
        }
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
                eq(clothingItems.userId, userId)
            )
        )
    } catch (e) {
        console.error(e)
        return {
            errors: { _form: "Cập nhật thất bại" },
            values: submittedValues
        }
    }
    revalidatePath('/wardrobe')
    redirect('/wardrobe')
}
