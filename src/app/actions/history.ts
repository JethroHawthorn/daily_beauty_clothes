'use server'

import { db } from '@/lib/db'
import { histories } from '@/db/schema'
import { verifySession } from '@/lib/session'
import { eq, desc } from 'drizzle-orm'

export async function getHistory() {
    const session = await verifySession()
    if (!session) return []
    
    try {
        const items = await db.query.histories.findMany({
            where: eq(histories.userId, session.userId),
            orderBy: [desc(histories.date), desc(histories.createdAt)]
        })
        return items
    } catch (e) {
        console.error(e)
        return []
    }
}
