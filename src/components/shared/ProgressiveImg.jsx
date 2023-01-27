import { useState, useEffect } from 'react'
import styled from '@emotion/styled'

const Img = styled.img`
  display: block;
  height: 100%;
  width: 100%;
  object-fit: cover;
  filter: ${(props) => (props.loading ? 'blur(10px)' : 'blur(0px)')};
  ${(props) => props.loading && 'clip-path: inset(0);'}
  ${(props) => props.loaded && 'transition: filter 0.5s linear;'}
`

const ProgressiveImg = ({ placeholderSrc, src, ...props }) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || src)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setImgSrc(src)
    }
  }, [src])

  const customClass =
    placeholderSrc && imgSrc === placeholderSrc ? 'loading' : 'loaded'

  /**
   * TODO:
   * use picture element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture
   * use uploadcare adaptive delivery (no need for offline fallback)
   * https://uploadcare.com/docs/delivery/adaptive-delivery/#adaptive-delivery
   */
  return (
    <Img
      {...{ src: imgSrc, ...props }}
      alt={props.alt || ''}
      className={`image ${customClass}`}
    />
  )
}
export default ProgressiveImg
