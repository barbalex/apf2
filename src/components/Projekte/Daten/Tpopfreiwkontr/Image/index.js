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
  align-self: stretch;
  justify-self: stretch;
  justify-content: stretch;
  align-content: stretch;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 20fr;
  grid-template-areas:
    'title'
    'myImage';
`
const Container = styled(Area)`
  grid-area: image;
`
const Title = styled.div`
  grid-area: title;
  font-weight: 700;
  justify-self: center;
`
const Img = styled.img`
  max-width: 100%;
  display: block;
  margin: 0 auto;
  max-height: 100%;
`
const ImageContainer = styled.div`
  grid-area: myImage;
  align-self: stretch;
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
        } catch (error) {
          return
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

  return (
    <Container>
      <Title>{artname}</Title>
      {!!image && (
        <ImageContainer>
          <Img src={image.default} alt={artname} />
        </ImageContainer>
      )}
    </Container>
  )
}

export default enhance(Image)
