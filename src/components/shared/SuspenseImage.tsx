import { Suspense, type ImgHTMLAttributes } from 'react'

interface SuspenseImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  fallback?: React.ReactNode
}

export const SuspenseImage = ({
  src,
  fallback = (
    <div style={{ background: '#f0f0f0', width: '100%', height: '100%' }} />
  ),
  ...props
}: SuspenseImageProps) => {
  return (
    <Suspense fallback={fallback}>
      <img
        src={src}
        {...props}
      />
    </Suspense>
  )
}
