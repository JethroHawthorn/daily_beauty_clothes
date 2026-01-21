import Link from 'next/link'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { verifySession } from '@/lib/session'
import { getWeather } from '@/lib/weather'
import { QuickAction } from '@/components/quick-action'
import { Sparkles, Shirt, CalendarHeart, Sun, CloudSun, Cloud, ArrowRight } from 'lucide-react'

export default async function HomePage() {
  await verifySession()
  const weather = await getWeather();

  return (
    <div className="container mx-auto p-4 max-w-md pb-20">
      <header className="mb-6 pt-6">
         <h1 className="text-2xl font-bold text-foreground">Chào người đẹp! 💃</h1>
         <p className="text-muted-foreground text-sm mt-1">Hôm nay diện gì cho thiên hạ trầm trồ đây?</p>
      </header>
      
      <div className="mb-8">
        <QuickAction />
      </div>

      {/* Weather Widget */}
      <Card className="mb-8 bg-white border border-border shadow-soft h-auto overflow-hidden">
          <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-rose opacity-10 rounded-bl-full pointer-events-none"></div>
              <div className="flex justify-between items-center relative z-10">
                  <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Thời tiết hiện tại</p>
                      {weather ? (
                        <>
                            <h2 className="text-5xl font-bold tracking-tighter text-foreground">{weather.temp}°</h2>
                            <p className="mt-2 font-medium flex items-center gap-2 text-sm text-foreground/80">
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
                  <div className="drop-shadow-sm filter">
                      {weather ? (
                        weather.temp > 25 ? (
                            <Sun className="w-16 h-16 text-yellow-500" strokeWidth={1.5} />
                        ) : (
                            <CloudSun className="w-16 h-16 text-orange-400" strokeWidth={1.5} />
                        )
                      ) : (
                        <Cloud className="w-16 h-16 text-muted-foreground/50" strokeWidth={1.5} />
                      )}
                  </div>
              </div>
          </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
          <Link href="/suggest" className="col-span-2">
            <Card className="h-full shadow-soft hover:shadow-soft-hover transition-card tap-scale cursor-pointer bg-gradient-to-br from-white to-rose-50/50 border-2 border-primary/10 group relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-primary" />
                </div>
                <CardContent className="flex flex-row items-center p-6 h-full gap-5">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md text-white shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Sparkles className="w-8 h-8" strokeWidth={2} />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold text-foreground">Gợi ý từ AI</CardTitle>
                        <CardDescription className="text-sm font-medium text-muted-foreground mt-1 line-clamp-1">Stylist 5 sao phục vụ 24/7</CardDescription>
                    </div>
                </CardContent>
            </Card>
          </Link>

          <Link href="/wardrobe">
            <Card className="h-full shadow-soft hover:shadow-soft-hover transition-card tap-scale cursor-pointer border border-border/50 bg-white group">
                <CardContent className="flex flex-col items-center justify-center p-5 text-center h-full gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors">
                        <Shirt className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-base font-semibold">Tủ đồ</CardTitle>
                        <CardDescription className="text-xs">Quản lý kho báu</CardDescription>
                    </div>
                </CardContent>
            </Card>
          </Link>

          <Link href="/history">
            <Card className="h-full shadow-soft hover:shadow-soft-hover transition-card tap-scale cursor-pointer border border-border/50 bg-white group">
                <CardContent className="flex flex-col items-center justify-center p-5 text-center h-full gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 group-hover:bg-purple-100 transition-colors">
                        <CalendarHeart className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-base font-semibold">Đã mặc</CardTitle>
                        <CardDescription className="text-xs">Nhật ký OOTD</CardDescription>
                    </div>
                </CardContent>
            </Card>
          </Link>
      </div>
    </div>
  )
}
