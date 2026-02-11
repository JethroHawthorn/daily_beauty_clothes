'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { db } from '@/lib/db'
import { clothingItems, histories } from '@/db/schema'
import { getWeather } from '@/lib/weather'
import { eq, gte, and } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { randomUUID } from 'crypto'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
interface OutfitSuggestion {
  items: string[];
  reason: string;
  selected_ids?: string[];
  outfit?: {
    top?: any;
    bottom?: any;
    shoes?: any;
    outerwear?: any;
  }
}




interface WeatherData {
  temp: number;
  condition: string;
  season: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateOutfit(prevState: any, formData: FormData) {
  const userId = formData.get('userId') as string
  if (!userId) return { error: "Bạn chưa đăng nhập" }

  const purpose = formData.get('purpose') as string
  
  // Get User Wardrobe
  const items = await db.query.clothingItems.findMany({
      where: eq(clothingItems.userId, userId)
  })

  // Get Recent History (Last 7 days for better rotation)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const dateString = sevenDaysAgo.toISOString().split('T')[0];

  const recentHistory = await db.query.histories.findMany({
      where: and(
          eq(histories.userId, userId),
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
    .flatMap(h => (h.combo as OutfitSuggestion).items || []);

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
  const clothingList = items.map(i => {
      const mainPart = i.name
      const detailPart = [i.type, i.color].filter(Boolean).join(' ')
      const fitPart = i.fit ? ` (${i.fit})` : ''
      return `- (ID: ${i.id}) ${mainPart} [${detailPart}${fitPart}]${i.isFavorite ? ' [YÊU THÍCH]' : ''}`
  }).join('\n')
  
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
 
    Trả về JSON ONLY theo cấu trúc sau:
    {
      "reason": "Lý do ngắn gọn...",
      "items": ["Tên món 1", "Tên món 2"],
      "outfit_ids": {
        "top": "ID_ITEM_TOP",
        "bottom": "ID_ITEM_BOTTOM",
        "shoes": "ID_ITEM_SHOES",
        "outerwear": "ID_ITEM_OUTERWEAR (nếu có)",
        "hat": "ID_ITEM_HAT (nếu có)",
        "glasses": "ID_ITEM_GLASSES (nếu có)",
        "mask": "ID_ITEM_MASK (nếu có)",
        "earrings": "ID_ITEM_EARRINGS (nếu có)"
      }
    }
  `

  let resultJson: any = null;

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

    // Map back to DB items
    const outfit: any = {};
    const outfitIds = resultJson.outfit_ids || {};
    
    // Helper to find item by ID
    const findItem = (id: string) => items.find(i => i.id === id);

    if (outfitIds) {
        Object.keys(outfitIds).forEach((key) => {
            const id = outfitIds[key];
            if (id) {
                const item = findItem(id);
                if (item) {
                    outfit[key] = {
                        id: item.id,
                        name: item.name,
                        imageUrl: item.imageUrl,
                        color: item.color,
                        type: item.type
                    };
                }
            }
        });
    }

    // Ensure items array exists for UI list, populated from the outfit selection
    if (!resultJson.items || resultJson.items.length === 0) {
        resultJson.items = Object.values(outfit).map((i: any) => i.name);
    }
    
    resultJson.outfit = outfit;

  } catch (e) {
      console.error("Gemini Error", e)
      return { error: "Không thể kết nối với AI Stylist. Vui lòng thử lại." }
  }
  
  return { success: true, suggestion: resultJson, weather, purpose }
}

export async function quickSuggest(userId: string) {
    if (!userId) return { error: "Bạn chưa đăng nhập" }

    const today = new Date();
    const dayOfWeek = today.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const purpose = isWeekend ? "Đi chơi cuối tuần" : "Đi làm/Đi học";

    const items = await db.query.clothingItems.findMany({
        where: eq(clothingItems.userId, userId)
    })

    // Get Recent History (Last 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const dateString = threeDaysAgo.toISOString().split('T')[0];

    const recentHistory = await db.query.histories.findMany({
        where: and(
            eq(histories.userId, userId),
            gte(histories.date, dateString)
        ),
        columns: { combo: true }
    })
    const recentItems = recentHistory.flatMap(h => (h.combo as OutfitSuggestion).items || [])
    const recentItemsString = recentItems.join(', ');

    const weather = await getWeather()
     if (!weather) {
      return { error: "Không thể lấy thông tin thời tiết." }
  }

  if (items.length === 0) {
      return { error: "Bạn cần thêm quần áo vào tủ đồ trước!" }
  }

   const clothingList = items.map(i => {
       const mainPart = i.name
       const detailPart = [i.type, i.color].filter(Boolean).join(' ')
       const fitPart = i.fit ? ` (${i.fit})` : ''
       return `- ${mainPart} [${detailPart}${fitPart}]${i.isFavorite ? ' [YÊU THÍCH]' : ''}`
   }).join('\n')

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
    - Trả về JSON ONLY theo cấu trúc sau:
      {
        "reason": "Lý do ngắn gọn...",
        "items": ["Tên món 1", "Tên món 2"],
        "outfit_ids": {
          "top": "ID_ITEM_TOP",
          "bottom": "ID_ITEM_BOTTOM",
          "shoes": "ID_ITEM_SHOES",
          "outerwear": "ID_ITEM_OUTERWEAR (nếu có)",
          "hat": "ID_ITEM_HAT (nếu có)",
          "glasses": "ID_ITEM_GLASSES (nếu có)",
          "mask": "ID_ITEM_MASK (nếu có)",
          "earrings": "ID_ITEM_EARRINGS (nếu có)"
        }
      }
  `
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const resultJson = JSON.parse(jsonText);

         // Map back to DB items
         const outfit: any = {};
         const outfitIds = resultJson.outfit_ids || {};
         
         const findItem = (id: string) => items.find(i => i.id === id);
     
         if (outfitIds) {
             Object.keys(outfitIds).forEach((key) => {
                 const id = outfitIds[key];
                 if (id) {
                     const item = findItem(id);
                     if (item) {
                         outfit[key] = {
                             id: item.id,
                             name: item.name,
                             imageUrl: item.imageUrl,
                             color: item.color,
                             type: item.type
                         };
                     }
                 }
             });
         }
     
         if (!resultJson.items || resultJson.items.length === 0) {
             resultJson.items = Object.values(outfit).map((i: any) => i.name);
         }
         
         resultJson.outfit = outfit;

        return { success: true, suggestion: resultJson, weather, purpose }
    } catch (e) {
        console.error("Gemini Error", e)
        return { error: "Lỗi kết nối AI." }
    }
}

export async function saveToHistory(suggestion: OutfitSuggestion, weather: WeatherData, purpose: string, userId: string) {
    if (!userId) redirect('/login')
    
    await db.insert(histories).values({
        id: randomUUID(),
        userId,
        date: new Date().toISOString().split('T')[0],
        purpose,
        combo: suggestion, // Drizzle handles JSON stringify if mode: json
        weather,
    })
    
    redirect('/history')
}
