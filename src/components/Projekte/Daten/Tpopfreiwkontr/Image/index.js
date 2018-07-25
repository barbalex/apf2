// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import withLifecycle from '@hocs/with-lifecycle'
import compose from 'recompose/compose'
import withState from 'recompose/withState'

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
  max-height: 370px;
  max-height: ${props => (props.width > 1013 ? '370px' : '390px')};
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
        let image
        try {
          image = await import(`./${apId}.png`)
        } catch (error) {}
        if (image && image.default) setImage(image)
      }
    },
  })
)

const Image = ({
  data,
  image,
  width,
}: {
  data: Object,
  image: Object,
  width: Number,
}) => {
  const artname = get(
    data,
    'tpopkontrById.tpopByTpopId.popByPopId.apByApId.aeEigenschaftenByArtId.artname',
    ''
  )

  return (
    <Container width={width}>
      <Title>{artname}</Title>
      {!!image && <ImageContainer image={image} />}
    </Container>
  )
}

export default enhance(Image)
