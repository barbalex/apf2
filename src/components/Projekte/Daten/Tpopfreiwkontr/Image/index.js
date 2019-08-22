import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import padding from './padding'

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
`
const Title = styled.div`
  grid-area: title;
  font-weight: 700;
  justify-self: center;
`
// https://www.voorhoede.nl/en/blog/say-no-to-image-reflow/
const ImageContainer = styled.div`
  grid-area: myImage;
  background-image: ${props => `url("${props.src}")`};
  background-origin: border-box;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  padding-bottom: ${props => (props.padding ? props.padding : 85)}%;
`

const fetchImageIfNeeded = async ({ image, setImage, apId }) => {
  if (!image) {
    let newImage
    try {
      newImage = await import(`./${apId}.png`) //.then(m => m.default)
    } catch (error) {}
    if (newImage && newImage.default) setImage(newImage.default)
  }
}

const Image = ({ row, artname, apId }) => {
  const [image, setImage] = useState(null)
  useEffect(() => {
    fetchImageIfNeeded({ apId, image, setImage })
  }, [apId, image])

  return (
    <Container>
      <Title>{artname}</Title>
      {!!image && <ImageContainer src={image} padding={padding[apId]} />}
    </Container>
  )
}

export default Image
