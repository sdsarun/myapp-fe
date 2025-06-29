import React from 'react'
import nextConfig from '@/next.config'
import NextImage, { ImageProps } from 'next/image'

export default function Image(props: ImageProps) {
  const imageSrc = typeof props.src === "string" && nextConfig.basePath ? nextConfig.basePath.concat(props.src) : props.src;
  return <NextImage {...props} src={imageSrc} />
}
