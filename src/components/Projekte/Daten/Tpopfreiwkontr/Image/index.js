// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import withLifecycle from '@hocs/with-lifecycle'
import compose from 'recompose/compose'
import withState from 'recompose/withState'

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

const enhance = compose(
  withState('image', 'setImage', ''),
  withLifecycle({
    async onDidMount(props) {
      const { row, setImage } = props
      const apId = get(row, 'tpopByTpopId.popByPopId.apByApId.id')
      let image
      try {
        image = await import(`./${apId}.png`).then(m => m.default)
      } catch (error) {}
      if (image && image.default) setImage(image.default)
    },
    async onDidUpdate(prevProps, props) {
      const { row, setImage, image } = props
      if (!image) {
        const apId = get(row, 'tpopByTpopId.popByPopId.apByApId.id')
        let image
        try {
          image = await import(`./${apId}.png`).then(m => m.default)
        } catch (error) {}
        if (image && image.default) setImage(image.default)
      }
    },
  }),
)

const Image = ({
  image,
  artname,
  apId,
}: {
  image: Object,
  artname: string,
  apId: string,
}) => (
  <Container>
    <Title>{artname}</Title>
    {!!image && <ImageContainer src={image} padding={padding[apId]} />}
  </Container>
)

export default enhance(Image)
