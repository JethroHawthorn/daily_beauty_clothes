'use client'

import { useActionState, useState } from 'react'
import { useUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { convertImageToPng } from '@/lib/convert-to-png'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (prevState: any, formData: FormData) => Promise<any>
  initialData?: {
    name: string
    type: string
    fit?: string | null
    color?: string | null
    material?: string | null
    season?: string[] | null
    imageUrl?: string | null
  }
  submitLabel?: string
  pendingLabel?: string
}

export function ClothingItemForm({ action, initialData, submitLabel = 'Nạp vào kho!', pendingLabel = 'Đang nhét vào tủ...' }: Props) {
  const [state, formAction, isPending] = useActionState(action, undefined)
  const { user } = useUser(false) // Don't redirect, just load
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null)
  const [isConverting, setIsConverting] = useState(false)
  const [processedFile, setProcessedFile] = useState<File | null>(null)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 1. Preview immediately
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      // 2. Start conversion
      setIsConverting(true)
      try {
        const pngFile = await convertImageToPng(file)
        setProcessedFile(pngFile)
        console.log("Image converted to PNG:", pngFile.name)
      } catch (error) {
        console.error("Failed to convert image to PNG, using original.", error)
        setProcessedFile(null) // Fallback to original
      } finally {
        setIsConverting(false)
      }
    }
  }

  const handleFormAction = (formData: FormData) => {
    if (processedFile) {
      if (processedFile.size > 4.5 * 1024 * 1024) {
        alert("Ảnh quá lớn (trên 4.5MB). Vui lòng chọn ảnh nhỏ hơn hoặc nén lại trước khi tải lên.")
        return;
      }
      formData.set('image', processedFile)
    }
    formAction(formData)
  }

  return (
    <form action={handleFormAction} className="space-y-8">
      <input type="hidden" name="userId" value={user?.id || ''} />
      {/* Image Upload Area */}
      <div className="relative aspect-square w-full rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/10 hover:bg-muted/20 transition-colors group cursor-pointer overflow-hidden">
        <input
          name="image"
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
        />

        {previewUrl ? (
          <>
            <Image src={previewUrl} alt="Preview" fill className="object-cover opacity-100 transition-opacity" />
            {isConverting && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="flex flex-col items-center text-white">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <span className="text-sm font-medium">Đang xử lý ảnh...</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground pointer-events-none">
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform z-20">
              <Camera className="w-8 h-8 opacity-80" strokeWidth={1.5} />
            </div>
            <span className="text-sm font-medium bg-white/50 backdrop-blur-sm rounded-full px-3 py-1 z-20">Chạm nhẹ để khoe ảnh</span>
          </div>
        )}
        {processedFile && processedFile.size > 4.5 * 1024 * 1024 && (
          <div className="absolute top-2 left-2 right-2 z-30 bg-red-500/90 text-white text-xs px-2 py-1 rounded shadow-sm text-center font-medium">
            Ảnh quá lớn ({Math.round(processedFile.size / 1024 / 1024)}MB). Tối đa 4.5MB.
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <Label htmlFor="name" className="text-base font-semibold mb-2 block">Tên em nó là gì?</Label>
          <Input
            name="name"
            id="name"
            required
            defaultValue={state?.values?.name ?? initialData?.name}
            placeholder="Ví dụ: Áo khoác Jean 'chất lừ'"
            className="h-12 bg-white/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type" className="text-base font-semibold mb-2 block">Thuộc hệ nào?</Label>
            <Input
              name="type"
              id="type"
              required
              defaultValue={state?.values?.type ?? initialData?.type}
              placeholder="Áo, Quần, Váy..."
              className="h-12 bg-white/50"
            />
          </div>
          <div>
            <Label htmlFor="fit" className="text-base font-semibold mb-2 block">Độ vừa vặn</Label>
            <div className="relative">
              <select
                name="fit"
                id="fit"
                defaultValue={state?.values?.fit ?? initialData?.fit ?? ''}
                className="w-full h-12 bg-white/50 border border-input rounded-md px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
              >
                <option value="" disabled>Chọn lẹ...</option>
                <option value="Ôm">Ôm (Body)</option>
                <option value="Vừa vặn">Vừa vặn (Regular)</option>
                <option value="Form rộng">Form rộng (Relaxed)</option>
                <option value="Oversize">Oversize (Thùng thình)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="color" className="text-base font-semibold mb-2 block">Màu mè ra sao?</Label>
            <Input
              name="color"
              id="color"
              defaultValue={state?.values?.color ?? initialData?.color ?? ''}
              placeholder="Xanh, Đỏ, Tím..."
              className="h-12 bg-white/50"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="material" className="text-base font-semibold mb-2 block">Chất liệu</Label>
          <Input
            name="material"
            id="material"
            defaultValue={state?.values?.material ?? initialData?.material ?? ''}
            placeholder="Jean, Cotton, Lụa..."
            className="h-12 bg-white/50"
          />
        </div>

        <div>
          <Label className="text-base font-semibold mb-3 block">Mùa nào diện được?</Label>
          <div className="flex flex-wrap gap-2">
            {['Xuân', 'Hạ', 'Thu', 'Đông'].map((s) => (
              <label key={s} className="relative group cursor-pointer">
                <input
                  type="checkbox"
                  name="season"
                  value={s}
                  defaultChecked={state?.values ? state.values.season?.includes(s) : initialData?.season?.includes(s)}
                  className="peer sr-only"
                />
                <span className="block px-4 py-2 bg-white border rounded-full text-sm font-medium text-muted-foreground transition-all peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary peer-checked:shadow-sm hover:bg-gray-50">
                  {s}
                </span>
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full h-14 text-lg rounded-full shadow-soft hover:shadow-soft-hover mt-4 font-bold" disabled={isPending || isConverting}>
          {isConverting ? 'Đang xử lý ảnh...' : (isPending ? pendingLabel : submitLabel)}
        </Button>

        {state?.success && <p className="text-green-600 text-center font-medium bg-green-50 p-2 rounded-lg">Xong! Hàng đã về bản.</p>}
        {state?.errors?._form && <p className="text-destructive text-center">{state.errors._form}</p>}
      </div>
    </form>
  )
}
