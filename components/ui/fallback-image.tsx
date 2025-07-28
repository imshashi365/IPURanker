"use client"

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface FallbackImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  fallbackSeed?: number
}

export default function FallbackImage({ 
  src, 
  alt, 
  width, 
  height, 
  className,
  fallbackSeed = 1
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      // Use a more reliable fallback service
      setImgSrc(`https://picsum.photos/${width}/${height}?random=${fallbackSeed}`)
    }
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={cn(className)}
      onError={handleError}
    />
  )
}
