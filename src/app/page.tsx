import Link from 'next/link'
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from '@/components/ui/card'
import { verifySession } from '@/lib/session'
import { getWeather } from '@/lib/weather'

export default async function HomePage() {
  await verifySession()
  const weather = await getWeather();

  return (
    <div className="container mx-auto p-4 max-w-md pb-20">
      <header className="mb-8 pt-6">
         <h1 className="text-2xl font-bold text-foreground">Xin chào! 👋</h1>
         <p className="text-muted-foreground text-sm mt-1">Hôm nay bạn muốn mặc gì?</p>
      </header>
      
      {/* Weather Widget */}
      <Card className={`mb-8 text-white border-none shadow-soft ${weather && weather.temp > 25 ? 'gradient-rose' : 'bg-secondary'}`}>
          <CardContent className="p-6">
              <div className="flex justify-between items-center">
                  <div>
                      <p className="text-sm font-medium opacity-90 mb-1">Thời tiết hiện tại</p>
                      {weather ? (
                        <>
                            <h2 className="text-5xl font-bold tracking-tighter">{weather.temp}°</h2>
                            <p className="mt-2 font-medium flex items-center gap-2 text-sm">
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
                  <div className="text-6xl drop-shadow-md">
                      {weather ? (weather.temp > 25 ? '☀️' : '⛅') : '🌥️'}
                  </div>
              </div>
          </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
          <Link href="/suggest">
            <Card className="shadow-soft hover:shadow-soft-hover transition-card tap-scale cursor-pointer border-l-4 border-l-accent">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                    <div className="text-2xl bg-accent-light p-3 rounded-full">✨</div>
                    <div className="flex flex-col">
                        <CardTitle className="text-base font-semibold">Gợi ý phối đồ</CardTitle>
                        <CardDescription className="text-sm">Để AI stylist chọn đồ giúp bạn</CardDescription>
                    </div>
                </CardHeader>
            </Card>
          </Link>

          <Link href="/wardrobe">
            <Card className="shadow-soft hover:shadow-soft-hover transition-card tap-scale cursor-pointer border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                    <div className="text-2xl bg-primary-light p-3 rounded-full">👕</div>
                    <div className="flex flex-col">
                         <CardTitle className="text-base font-semibold">Tủ đồ của tôi</CardTitle>
                        <CardDescription className="text-sm">Quản lý quần áo</CardDescription>
                    </div>
                </CardHeader>
            </Card>
          </Link>

          <Link href="/history">
            <Card className="shadow-soft hover:shadow-soft-hover transition-card tap-scale cursor-pointer border-l-4 border-l-secondary">
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                    <div className="text-2xl bg-secondary-light p-3 rounded-full">📅</div>
                    <div className="flex flex-col">
                        <CardTitle className="text-base font-semibold">Lịch sử</CardTitle>
                        <CardDescription className="text-sm">Xem lại trang phục đã mặc</CardDescription>
                    </div>
                </CardHeader>
            </Card>
          </Link>
      </div>
    </div>
  )
}


