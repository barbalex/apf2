import React, { useState, useCallback } from 'react'
import styled from '@emotion/styled'

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
  container-type: size;
  min-height: 250px;
  @media print {
    -webkit-print-color-adjust: exact;
  }
`

const ImageContainer = styled.div`
  grid-area: myImage;
  height: calc(100cqh - 20px);
`
const Img = styled.img`
  height: 100%;
  width: 100%;
  object-fit: contain;
`
const Title = styled.div`
  grid-area: title;
  font-weight: 700;
  justify-self: center;
`
const NotifContainer = styled.div`
  grid-area: myImage;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Image = ({ artname, apId }) => {
  const [notif, setNotif] = useState(null)

  // show notification if image is not found
  // also: do not show image when notification is shown
  //       because hideous placeholder is shown
  const onError = useCallback(
    () => setNotif(`Für ${artname} wurde kein Bild gefunden`),
    [artname],
  )

  return (
    <Container>
      <Title>{artname}</Title>
      {!notif && (
        <ImageContainer>
          <picture>
            <source srcSet={`/${apId}.avif`} type="image/avif" />
            <Img src={`/${apId}.webp`} onError={onError} alt={artname} />
          </picture>
        </ImageContainer>
      )}
      {!!notif && <NotifContainer>{notif}</NotifContainer>}
    </Container>
  )
}

export default Image
