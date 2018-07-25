// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import withLifecycle from '@hocs/with-lifecycle'
import compose from 'recompose/compose'
import withState from 'recompose/withState'

const Area = styled.div`
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
const Container = styled(Area)`
  grid-area: image;
  max-height: 370px;
  @media print {
    max-height: 325px;
  }
`
const Title = styled.div`
  grid-area: title;
  font-weight: 700;
  justify-self: center;
`
const ImageContainer = styled.div`
  grid-area: myImage;
  background-image: ${props => `url("${props.image.default}")`};
  background-origin: border-box;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`

const enhance = compose(
  withState('image', 'setImage', null),
  withLifecycle({
    async onDidUpdate(prevProps, props) {
      const { data, setImage, image } = props
      if (!image) {
        const apId = get(
          data,
          'tpopkontrById.tpopByTpopId.popByPopId.apByApId.id'
        )
        console.log('Image, onDidUpdate, apId:', apId)
        let image
        try {
          image = await import(`./${apId}.png`)
          console.log('Image, onDidUpdate, image:', image)
        } catch (error) {
          return console.log('Image, error loading image:', error.message)
        }
        if (image && image.default) setImage(image)
      }
    },
  })
)

const Image = ({ data, image }: { data: Object, image: Object }) => {
  const artname = get(
    data,
    'tpopkontrById.tpopByTpopId.popByPopId.apByApId.aeEigenschaftenByArtId.artname',
    ''
  )
  console.log('Image, render:', { image })

  return (
    <Container>
      <Title>{artname}</Title>
      {!!image && <ImageContainer image={image} />}
    </Container>
  )
}

export default enhance(Image)
