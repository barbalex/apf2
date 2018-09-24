// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import debounce from 'lodash/debounce'
import withLifecycle from '@hocs/with-lifecycle'
import compose from 'recompose/compose'
import pure from 'recompose/pure'
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
  max-height: ${props => (props.height ? props.height : 370)}px;
  /*@media print {
    max-height: 325px;
  }*/
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
  withState('image', 'setImage', null),
  withState('heightInternal', 'setHeightInternal', 370),
  withLifecycle({
    async onDidUpdate(prevProps, props) {
      const { row, setImage, image, height, setHeightInternal } = props
      if (!image) {
        const apId = get(row, 'tpopByTpopId.popByPopId.apByApId.id')
        let image
        try {
          image = await import(`./${apId}.png`)
        } catch (error) {}
        if (image && image.default) setImage(image.default)
      }
      const debounceSetHeightInternal = debounce(setHeightInternal, 400)
      debounceSetHeightInternal(height)
    },
  }),
  pure,
)

const Image = ({
  image,
  parentwidth,
  height,
  heightInternal,
  artname,
  apId,
}: {
  image: Object,
  parentwidth: number,
  height: number,
  heightInternal: number,
  artname: string,
  apId: string,
}) => {
  const myPadding = padding[apId]
  const src = image ? image : ''

  return (
    <Container height={parentwidth >= 800 ? heightInternal : 370}>
      <Title>{artname}</Title>
      {!!image && <ImageContainer src={src} padding={myPadding} />}
    </Container>
  )
}

export default enhance(Image)
