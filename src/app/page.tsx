import Link from 'next/link'
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from '@/components/ui/card'
import { verifySession } from '@/lib/session'
import { getWeather } from '@/lib/weather'

export default async function HomePage() {
  await verifySession()
  const weather = await getWeather();

  return (
    <div className="container mx-auto p-4 max-w-md pb-20">
      <header className="mb-8 pt-4">
         <h1 className="text-3xl font-bold">Xin chào! 👋</h1>
         <p className="text-gray-500">Hôm nay bạn muốn mặc gì?</p>
      </header>
      
      {/* Weather Widget */}
      <Card className="mb-8 bg-gradient-to-br from-blue-500 to-cyan-400 text-white border-none shadow-lg">
          <CardContent className="p-6">
              <div className="flex justify-between items-center">
                  <div>
                      <p className="text-sm font-medium opacity-90 mb-1">Thời tiết hiện tại</p>
                      {weather ? (
                        <>
                            <h2 className="text-5xl font-bold tracking-tighter">{weather.temp}°</h2>
                            <p className="mt-2 font-medium flex items-center gap-2">
                                <span>{weather.full.location}</span> • <span>{weather.condition}</span>
                            </p>
                        </>
                      ) : (
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl font-bold">--°</h2>
                            <p className="text-sm opacity-80">Không có dữ liệu thời tiết</p>
                        </div>
                      )}
                  </div>
                  <div className="text-7xl drop-shadow-md">
                      {weather ? (weather.temp > 25 ? '☀️' : '⛅') : '🌥️'}
                  </div>
              </div>
          </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
          <Link href="/suggest">
            <Card className="hover:shadow-md transition-all active:scale-95 cursor-pointer border-l-4 border-l-orange-400">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                    <div className="text-3xl bg-orange-100 p-3 rounded-xl">✨</div>
                    <div className="flex flex-col">
                        <CardTitle className="text-lg">Gợi ý phối đồ</CardTitle>
                        <CardDescription>Để AI stylist chọn đồ giúp bạn</CardDescription>
                    </div>
                </CardHeader>
            </Card>
          </Link>

          <Link href="/wardrobe">
            <Card className="hover:shadow-md transition-all active:scale-95 cursor-pointer border-l-4 border-l-purple-400">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                    <div className="text-3xl bg-purple-100 p-3 rounded-xl">👕</div>
                    <div className="flex flex-col">
                         <CardTitle className="text-lg">Tủ đồ của tôi</CardTitle>
                        <CardDescription>Quản lý quần áo</CardDescription>
                    </div>
                </CardHeader>
            </Card>
          </Link>

          <Link href="/history">
            <Card className="hover:shadow-md transition-all active:scale-95 cursor-pointer border-l-4 border-l-green-400">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                    <div className="text-3xl bg-green-100 p-3 rounded-xl">📅</div>
                    <div className="flex flex-col">
                        <CardTitle className="text-lg">Lịch sử</CardTitle>
                        <CardDescription>Xem lại trang phục đã mặc</CardDescription>
                    </div>
                </CardHeader>
            </Card>
          </Link>
      </div>
    </div>
  )
}
