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
  const clothingList = items.map(i => `- ${i.name} (${i.color} ${i.type}, ${i.style})${i.isFavorite ? ' [YÊU THÍCH]' : ''}`).join('\n')
  
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
    - ƯU TIÊN sử dụng các món đồ có đánh dấu [YÊU THÍCH] nếu phù hợp.
    - CHỈ sử dụng đồ có trong Tủ đồ của người dùng.
    - Giải thích tại sao chọn bộ này (ngắn gọn bằng Tiếng Việt).
    - Trả về JSON ONLY: { "items": ["Tên chính xác từ danh sách", "Tên chính xác 2"], "reason": "Lý do..." }
  `

  let resultJson = null;

  if (!process.env.GEMINI_API_KEY) {
      return { error: "Thiếu cấu hình GEMINI_API_KEY" }
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
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

export async function quickSuggest() {
    const session = await verifySession()
    if (!session) redirect('/login')

    const today = new Date();
    const dayOfWeek = today.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const purpose = isWeekend ? "Đi chơi cuối tuần" : "Đi làm/Đi học";

    // Mock FormData-like behavior or reuse logic. 
    // Since generateOutfit expects FormData, we can extract the common logic or just reuse the code. 
    // For cleaner code, I will duplicate the logic slightly or refactor. 
    // Given the constraints, I'll implement the logic directly here calling common helpers if I had them, 
    // but I'll self-contained it here for safety.

    const items = await db.query.clothingItems.findMany({
        where: eq(clothingItems.userId, session.userId)
    })

    const weather = await getWeather()
     if (!weather) {
      return { error: "Không thể lấy thông tin thời tiết." }
  }

  if (items.length === 0) {
      return { error: "Bạn cần thêm quần áo vào tủ đồ trước!" }
  }

   const clothingList = items.map(i => `- ${i.name} (${i.color} ${i.type}, ${i.style})${i.isFavorite ? ' [YÊU THÍCH]' : ''}`).join('\n')

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
    - Đề xuất 1 bộ trang phục phối hợp NHANH cho ngày hôm nay.
    - ƯU TIÊN CAO sử dụng các món đồ [YÊU THÍCH].
    - CHỈ sử dụng đồ có trong Tủ đồ của người dùng.
    - Giải thích ngắn gọn (1 câu).
    - Trả về JSON ONLY: { "items": ["Tên chính xác từ danh sách", "Tên chính xác 2"], "reason": "Lý do..." }
  `
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const resultJson = JSON.parse(jsonText);
        return { success: true, suggestion: resultJson, weather, purpose }
    } catch (e) {
        console.error("Gemini Error", e)
        return { error: "Lỗi kết nối AI." }
    }
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
