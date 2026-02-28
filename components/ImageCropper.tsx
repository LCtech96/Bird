"use client"

import { useState, useCallback, useEffect } from "react"
import Cropper from "react-easy-crop"
import { X, Check } from "lucide-react"

interface ImageCropperProps {
  image: string
  onCropComplete: (croppedImage: string) => void
  onCancel: () => void
  aspectRatio?: number
  cropShape?: "rect" | "round"
}

export function ImageCropper({
  image,
  onCropComplete,
  onCancel,
  aspectRatio = 1,
  cropShape = "rect"
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [cropperImageUrl, setCropperImageUrl] = useState<string>(() =>
    image.startsWith("data:") ? "" : image
  )

  // Su mobile i data URL lunghi non si caricano bene nel Cropper: converti in object URL
  useEffect(() => {
    if (!image) return
    if (!image.startsWith("data:")) {
      setCropperImageUrl(image)
      return
    }
    let objectUrl: string | null = null
    const init = async () => {
      try {
        const res = await fetch(image)
        const blob = await res.blob()
        objectUrl = URL.createObjectURL(blob)
        setCropperImageUrl(objectUrl)
      } catch {
        setCropperImageUrl(image)
      }
    }
    init()
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [image])

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop)
  }, [])

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom)
  }, [])

  const onCropCompleteCallback = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.addEventListener("load", () => resolve(img))
      img.addEventListener("error", (error) => reject(error))
      img.src = url
    })

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number }
  ): Promise<string> => {
    const img = await createImage(imageSrc)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      throw new Error("No 2d context")
    }

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.drawImage(
      img,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"))
            return
          }
          const reader = new FileReader()
          reader.addEventListener("load", () => resolve(reader.result as string))
          reader.addEventListener("error", (error) => reject(error))
          reader.readAsDataURL(blob)
        },
        "image/jpeg",
        0.9
      )
    })
  }

  const handleCrop = async () => {
    const imageToUse = cropperImageUrl || image
    try {
      let pixelCrop = croppedAreaPixels
      if (!pixelCrop) {
        const img = await createImage(imageToUse)
        pixelCrop = {
          x: 0,
          y: 0,
          width: img.naturalWidth,
          height: img.naturalHeight
        }
      }
      const croppedImage = await getCroppedImg(imageToUse, pixelCrop)
      onCropComplete(croppedImage)
    } catch (error) {
      console.error("Error cropping image:", error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold">Ritaglia Immagine</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper: altezza fissa così l'immagine si vede anche su mobile */}
        <div className="relative w-full h-[min(60vh,400px)] min-h-[280px] bg-muted flex items-center justify-center">
          {cropperImageUrl ? (
            <Cropper
              image={cropperImageUrl}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              cropShape={cropShape}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropCompleteCallback}
              style={{
                containerStyle: {
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  backgroundColor: "var(--muted)"
                }
              }}
            />
          ) : (
            <p className="text-muted-foreground">Caricamento immagine...</p>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-border space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium block">
              Zoom: {Math.round(zoom * 100)}%
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={handleCrop}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Conferma Ritaglio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
