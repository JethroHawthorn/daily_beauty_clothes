'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { useState, useEffect } from 'react'

export function WardrobeFilters() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    
    // Local state for UI sync
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
    const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all')
    const [selectedSeason, setSelectedSeason] = useState(searchParams.get('season') || 'all')
    const [isFavorite, setIsFavorite] = useState(searchParams.get('isFavorite') === 'true')

    const hasFilters = searchTerm || selectedType !== 'all' || selectedSeason !== 'all' || isFavorite

    // Sync with URL when params change externally
    useEffect(() => {
        setSearchTerm(searchParams.get('search') || '')
        setSelectedType(searchParams.get('type') || 'all')
        setSelectedSeason(searchParams.get('season') || 'all')
        setIsFavorite(searchParams.get('isFavorite') === 'true')
    }, [searchParams])

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('search', term)
        } else {
            params.delete('search')
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    const handleTypeChange = (value: string) => {
        const params = new URLSearchParams(searchParams)
        setSelectedType(value)
        if (value && value !== 'all') {
            params.set('type', value)
        } else {
            params.delete('type')
        }
        replace(`${pathname}?${params.toString()}`)
    }

    const handleSeasonChange = (value: string) => {
        const params = new URLSearchParams(searchParams)
        setSelectedSeason(value)
        if (value && value !== 'all') {
            params.set('season', value)
        } else {
            params.delete('season')
        }
        replace(`${pathname}?${params.toString()}`)
    }
    
    const toggleFavoriteFilter = () => {
        const params = new URLSearchParams(searchParams)
        const newValue = !isFavorite
        setIsFavorite(newValue)
        if (newValue) {
            params.set('isFavorite', 'true')
        } else {
            params.delete('isFavorite')
        }
        replace(`${pathname}?${params.toString()}`)
    }

    const clearFilters = () => {
        setSearchTerm('')
        setSelectedType('all')
        setSelectedSeason('all')
        setIsFavorite(false)
        replace(`${pathname}`)
    }

    return (
        <div className="space-y-4 mb-6">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Tìm kiếm quần áo..." 
                        className="pl-9 bg-background/50" 
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            handleSearch(e.target.value)
                        }}
                    />
                </div>
                <Button 
                    variant={isFavorite ? "default" : "outline"}
                    size="icon"
                    onClick={toggleFavoriteFilter}
                    className={isFavorite ? "bg-rose-500 hover:bg-rose-600 text-white border-rose-500" : "text-rose-500 border-rose-200 hover:bg-rose-50"}
                >
                    <span className="text-xl">❤️</span>
                </Button>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none items-center">
                 <Select value={selectedType} onValueChange={handleTypeChange}>
                    <SelectTrigger className="w-[140px] h-9 text-xs">
                        <SelectValue placeholder="Loại trang phục" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả loại</SelectItem>
                        <SelectItem value="Áo thun">Áo thun</SelectItem>
                        <SelectItem value="Áo sơ mi">Áo sơ mi</SelectItem>
                        <SelectItem value="Quần jeans">Quần jeans</SelectItem>
                        <SelectItem value="Quần tây">Quần tây</SelectItem>
                        <SelectItem value="Váy">Váy</SelectItem>
                        <SelectItem value="Áo khoác">Áo khoác</SelectItem>
                        <SelectItem value="Giày">Giày</SelectItem>
                        <SelectItem value="Phụ kiện">Phụ kiện</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={selectedSeason} onValueChange={handleSeasonChange}>
                    <SelectTrigger className="w-[130px] h-9 text-xs">
                        <SelectValue placeholder="Mùa" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả mùa</SelectItem>
                        <SelectItem value="Xuân">Mùa Xuân</SelectItem>
                        <SelectItem value="Hạ">Mùa Hạ</SelectItem>
                        <SelectItem value="Thu">Mùa Thu</SelectItem>
                        <SelectItem value="Đông">Mùa Đông</SelectItem>
                    </SelectContent>
                </Select>

                {hasFilters && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFilters}
                        className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground shrink-0"
                    >
                        <X className="w-3.5 h-3.5 mr-1" /> Xoá lọc
                    </Button>
                )}
            </div>
        </div>
    )
}
