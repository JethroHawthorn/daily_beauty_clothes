'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { db } from '@/lib/db'
import { clothingItems, histories } from '@/db/schema'
import { verifySession } from '@/lib/session'
import { getWeather } from '@/lib/weather'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { randomUUID } from 'crypto'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateOutfit(prevState: any, formData: FormData) {
  const session = await verifySession()
  if (!session) redirect('/login')

  const purpose = formData.get('purpose') as string
  
  // Get User Wardrobe
  const items = await db.query.clothingItems.findMany({
      where: eq(clothingItems.userId, session.userId)
  })

  // Get Weather
  const weather = await getWeather()
  if (!weather) {
      return { error: "Không thể lấy thông tin thời tiết. Vui lòng kiểm tra cấu hình WEATHER_API_KEY." }
  }

  if (items.length === 0) {
      return { error: "Bạn cần thêm quần áo vào tủ đồ trước!" }
  }

  // Construct Prompt
  const clothingList = items.map(i => `- ${i.name} (${i.color} ${i.type}, ${i.style})`).join('\n')
  
  const prompt = `
    Bạn là stylist cá nhân.
    
    Tủ đồ của người dùng:
    ${clothingList}
    
    Ngữ cảnh:
    - Nhiệt độ: ${weather.temp}°C
    - Thời tiết: ${weather.condition}
    - Mùa: ${weather.season}
    - Mục đích: ${purpose}
    
    Yêu cầu:
    - Đề xuất 1 bộ trang phục phối hợp.
    - CHỈ sử dụng đồ có trong Tủ đồ của người dùng.
    - Giải thích tại sao chọn bộ này (ngắn gọn bằng Tiếng Việt).
    - Trả về JSON ONLY: { "items": ["Tên chính xác từ danh sách", "Tên chính xác 2"], "reason": "Lý do..." }
  `

  let resultJson = null;

  if (!process.env.GEMINI_API_KEY) {
      return { error: "Thiếu cấu hình GEMINI_API_KEY" }
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    resultJson = JSON.parse(jsonText);
  } catch (e) {
      console.error("Gemini Error", e)
      return { error: "Không thể kết nối với AI Stylist. Vui lòng thử lại." }
  }
  
  return { success: true, suggestion: resultJson, weather, purpose }
}

export async function saveToHistory(suggestion: any, weather: any, purpose: string) {
    const session = await verifySession()
    if (!session) redirect('/login')
    
    await db.insert(histories).values({
        id: randomUUID(),
        userId: session.userId,
        date: new Date().toISOString().split('T')[0],
        purpose,
        combo: suggestion, // Drizzle handles JSON stringify if mode: json
        weather,
    })
    
    redirect('/history')
}
