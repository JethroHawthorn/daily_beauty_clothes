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
         <h1 className="text-2xl font-bold text-foreground">Chào người đẹp! 💃</h1>
         <p className="text-muted-foreground text-sm mt-1">Hôm nay diện gì cho thiên hạ trầm trồ đây?</p>
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

      <div className="grid grid-cols-2 gap-4">
          <Link href="/suggest" className="col-span-2">
            <Card className="h-full shadow-soft hover:shadow-soft-hover transition-card tap-scale cursor-pointer bg-gradient-to-br from-accent-light to-white border-2 border-accent/20">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full gap-3">
                    <div className="text-4xl bg-white p-4 rounded-full shadow-sm">✨</div>
                    <div>
                        <CardTitle className="text-lg font-bold text-foreground">Gợi ý từ Thượng Đế</CardTitle>
                        <CardDescription className="text-sm font-medium text-muted-foreground mt-1">Để AI stylist trổ tài biến hình</CardDescription>
                    </div>
                </CardContent>
            </Card>
          </Link>

          <Link href="/wardrobe">
            <Card className="h-full shadow-soft hover:shadow-soft-hover transition-card tap-scale cursor-pointer border-2 border-primary/10 hover:border-primary/30 bg-primary-light/30">
                <CardContent className="flex flex-col items-center justify-center p-5 text-center h-full gap-2">
                    <div className="text-3xl mb-1">👕</div>
                    <CardTitle className="text-base font-semibold">Kho báu</CardTitle>
                    <CardDescription className="text-xs">Gia tài quần áo</CardDescription>
                </CardContent>
            </Card>
          </Link>

          <Link href="/history">
            <Card className="h-full shadow-soft hover:shadow-soft-hover transition-card tap-scale cursor-pointer border-2 border-secondary/10 hover:border-secondary/30 bg-secondary-light/30">
                <CardContent className="flex flex-col items-center justify-center p-5 text-center h-full gap-2">
                    <div className="text-3xl mb-1">📅</div>
                    <CardTitle className="text-base font-semibold">Sổ tay</CardTitle>
                    <CardDescription className="text-xs">Hành trình nhan sắc</CardDescription>
                </CardContent>
            </Card>
          </Link>
      </div>
    </div>
  )
}


