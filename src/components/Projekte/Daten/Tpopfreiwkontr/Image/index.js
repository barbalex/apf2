import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import padding from './padding'

/**
 * see https://stackoverflow.com/a/21160150/712005 to force printing background image
 */

const Container = styled.div`
  grid-area: image;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  break-inside: avoid;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 20fr;
  grid-template-areas:
    'title'
    'myImage';
  @media print {
    -webkit-print-color-adjust: exact;
  }
`
const Title = styled.div`
  grid-area: title;
  font-weight: 700;
  justify-self: center;
`
// https://www.voorhoede.nl/en/blog/say-no-to-image-reflow/
const ImageContainer = styled.div`
  grid-area: myImage;
  background-image: ${(props) => `url("${props.src}") !important`};
  background-origin: border-box;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  padding-bottom: ${(props) => (props.padding ? props.padding : 85)}%;
`
const NotifContainer = styled.div`
  grid-area: myImage;
  display: flex;
  justify-content: center;
  align-items: center;
`

const fetchImageIfNeeded = async ({
  image,
  setImage,
  setNotif,
  apId,
  artname,
  isActive,
}) => {
  if (!image && !!apId) {
    let newImage
    try {
      newImage = await import(`./${apId}.png`)
    } catch (error) {
      if (!isActive) return

      return setNotif(`Für ${artname} wurde kein Bild gefunden`)
    }
    if (!isActive) return

    if (newImage && newImage.default) setImage(newImage.default)
  }
}

const Image = ({ artname, apId }) => {
  const [image, setImage] = useState(null)
  const [notif, setNotif] = useState(null)

  useEffect(() => {
    setImage(null)
    setNotif(null)
  }, [apId])

  useEffect(() => {
    let isActive = true
    fetchImageIfNeeded({ apId, artname, image, setImage, setNotif, isActive })

    return () => {
      isActive = false
    }
  }, [apId, artname, image])

  return (
    <Container>
      <Title>{artname}</Title>
      {!!image && <ImageContainer src={image} padding={padding[apId]} />}
      {!!notif && <NotifContainer>{notif}</NotifContainer>}
    </Container>
  )
}

export default Image
