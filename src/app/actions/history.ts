'use server'

import { db } from '@/lib/db'
import { histories } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'


export async function getHistory(userId: string) {
    if (!userId) return []
    
    try {
        const items = await db.query.histories.findMany({
            where: eq(histories.userId, userId),
            orderBy: [desc(histories.date), desc(histories.createdAt)]
        })
        return items
    } catch (e) {
        console.error(e)
        return []
    }
}
