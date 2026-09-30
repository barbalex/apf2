import { useState, type ImgHTMLAttributes, type ReactNode } from 'react'

interface SuspenseImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  fallback?: ReactNode
}

// <img> does not suspend in React, so track loading ourselves:
// show the fallback until the image has loaded (or failed to load)
export const SuspenseImage = ({
  src,
  fallback = (
    <div style={{ background: '#f0f0f0', width: '100%', height: '100%' }} />
  ),
  ...props
}: SuspenseImageProps) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {loaded ? null : fallback}
      <img
        src={src}
        {...props}
        // images served from cache can be complete before onLoad is attached
        ref={(node) => {
          if (node?.complete && node.naturalWidth > 0) setLoaded(true)
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        style={loaded ? props.style : { ...props.style, display: 'none' }}
      />
    </>
  )
}
