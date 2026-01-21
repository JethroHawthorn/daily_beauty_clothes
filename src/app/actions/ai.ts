'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { db } from '@/lib/db'
import { clothingItems, histories } from '@/db/schema'
import { verifySession } from '@/lib/session'
import { getWeather } from '@/lib/weather'
import { eq, desc, gte, and } from 'drizzle-orm'
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

  // Get Recent History (Last 7 days for better rotation)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const dateString = sevenDaysAgo.toISOString().split('T')[0];

  const recentHistory = await db.query.histories.findMany({
      where: and(
          eq(histories.userId, session.userId),
          gte(histories.date, dateString)
      ),
      columns: { combo: true, date: true }
  })

  // Basic "Do not repeat" list (last 3 days)
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const threeDaysAgoStr = threeDaysAgo.toISOString().split('T')[0];
  
  const extremelyRecentItems = recentHistory
    .filter(h => h.date >= threeDaysAgoStr)
    .flatMap(h => (h.combo as any).items || []);

  const recentItemsString = extremelyRecentItems.join(', ');

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
    Bạn là stylist cá nhân thân thiện, tinh tế và nói chuyện rất đời thường.
    
    === NGUYÊN TẮC AN TOÀN (BẮT BUỘC) ===
    AI TUYỆT ĐỐI KHÔNG ĐƯỢC:
    - Gợi ý mua thêm trang phục mới
    - So sánh cơ thể người dùng
    - Chê trang phục hiện tại của người dùng
    - Đưa ra nhận xét mang tính phán xét
    - Tạo áp lực thay đổi phong cách
    - Dùng từ ngữ tuyệt đối như "tốt nhất", "hoàn hảo", "bắt buộc"
    
    AI CHỈ ĐƯỢC:
    - Phối đồ từ những trang phục người dùng ĐÃ CÓ trong tủ đồ
    - Gợi ý mang tính hỗ trợ, không áp đặt
    - Dùng câu ngắn, ngôn từ đời thường, thân thiện
    ================================
    
    Tủ đồ của người dùng:
    ${clothingList}
    
    Các món ĐÃ MẶC trong 3 ngày qua (TRÁNH LẶP LẠI nếu có thể):
    ${recentItemsString}

    Ngữ cảnh:
    - Nhiệt độ: ${weather.temp}°C
    - Thời tiết: ${weather.condition}
    - Mùa: ${weather.season}
    - Mục đích: ${purpose}
    
    Yêu cầu:
    - Đề xuất 1 bộ trang phục phối hợp.
    - ƯU TIÊN sử dụng các món đồ có đánh dấu [YÊU THÍCH] nếu phù hợp.
    - CHỈ sử dụng đồ có trong Tủ đồ của người dùng.
    - NẾU có món đồ nào lâu rồi chưa mặc, hãy ưu tiên gợi ý nó.
    
    Tông giọng:
    - Nhẹ nhàng, gợi mở ("Bạn thử kết hợp...", "Combo này khá hợp với...").
    - Giải thích CỰC KỲ NGẮN GỌN (1-2 câu), tập trung cảm giác thực tế.

    Trả về JSON ONLY: { "items": ["Tên chính xác từ danh sách", "Tên chính xác 2"], "reason": "Lý do..." }
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

    const items = await db.query.clothingItems.findMany({
        where: eq(clothingItems.userId, session.userId)
    })

    // Get Recent History (Last 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const dateString = threeDaysAgo.toISOString().split('T')[0];

    const recentHistory = await db.query.histories.findMany({
        where: and(
            eq(histories.userId, session.userId),
            gte(histories.date, dateString)
        ),
        columns: { combo: true }
    })
    const recentItems = recentHistory.flatMap(h => (h.combo as any).items || [])
    const recentItemsString = recentItems.join(', ');

    const weather = await getWeather()
     if (!weather) {
      return { error: "Không thể lấy thông tin thời tiết." }
  }

  if (items.length === 0) {
      return { error: "Bạn cần thêm quần áo vào tủ đồ trước!" }
  }

   const clothingList = items.map(i => `- ${i.name} (${i.color} ${i.type}, ${i.style})${i.isFavorite ? ' [YÊU THÍCH]' : ''}`).join('\n')

    const prompt = `
    Bạn là stylist cá nhân thân thiện.
    
    === NGUYÊN TẮC AN TOÀN (BẮT BUỘC) ===
    AI TUYỆT ĐỐI KHÔNG ĐƯỢC:
    - Gợi ý mua thêm trang phục mới
    - So sánh cơ thể người dùng
    - Chê trang phục hiện tại
    - Đưa ra nhận xét phán xét
    - Dùng từ "tốt nhất", "hoàn hảo", "bắt buộc"
    
    AI CHỈ ĐƯỢC:
    - Phối đồ từ trang phục người dùng ĐÃ CÓ
    - Gợi ý mang tính hỗ trợ, không áp đặt
    ================================
    
    Tủ đồ của người dùng:
    ${clothingList}
    
    Đã mặc gần đây (HẠN CHẾ LẶP LẠI): ${recentItemsString}

    Ngữ cảnh:
    - Nhiệt độ: ${weather.temp}°C
    - Thời tiết: ${weather.condition}
    - Mùa: ${weather.season}
    - Mục đích: ${purpose}
    
    Yêu cầu:
    - Đề xuất 1 bộ trang phục phối hợp NHANH cho ngày hôm nay.
    - ƯU TIÊN CAO sử dụng các món đồ [YÊU THÍCH].
    - CHỈ sử dụng đồ có trong Tủ đồ của người dùng.
    - Giải thích: Ngắn gọn, thân thiện (1 câu).
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
