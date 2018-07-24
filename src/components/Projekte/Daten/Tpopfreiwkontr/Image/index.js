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
`
const Container = styled(Area)`
  grid-area: image;
`
const Title = styled.div`
  grid-area: title;
  font-weight: 700;
  text-align: center;
`
const Img = styled.img`
  max-width: 100%;
  height: 365px;
  display: block;
  margin: 0 auto;
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
        console.log('Image, onDidMount:', { props, apId })
        let image
        try {
          image = await import(`./${apId}.png`)
        } catch (error) {
          return console.log('no image found')
        }
        setImage(image)
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
  console.log('Image, render, image:', image)

  return (
    <Container>
      <Title>{artname}</Title>
      {!!image && <Img src={image.default} alt={artname} />}
    </Container>
  )
}

export default enhance(Image)
