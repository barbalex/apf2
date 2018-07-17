// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'

import TextField from '../../../shared/TextField'
import anteilImg from './anteil.png'

const Area = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
`
const Container = styled(Area)`
  grid-area: cover;
  display: grid;
  grid-template-columns: 4fr 3fr 1fr;
  grid-template-areas:
    'deckApArtLabel deckApArtVal deckApArtMass'
    'deckNaBoLabel deckNaBoVal deckNaBoMass'
    'deckImage deckImage deckImage';
`
const Label = styled.div`
  font-weight: 700;
  padding-right: 4px;
`
const DeckApArtLabel = styled(Label)`
  grid-area: deckApArtLabel;
`
const DeckApArtVal = styled.div`
  grid-area: deckApArtVal;
  > div {
    margin-top: -25px;
  }
`
const DeckApArtMass = styled.div`
  grid-area: deckApArtMass;
`
const DeckNaBoLabel = styled(Label)`
  grid-area: deckNaBoLabel;
`
const DeckNaBoVal = styled.div`
  grid-area: deckNaBoVal;
  > div {
    margin-top: -25px;
  }
`
const DeckNaBoMass = styled.div`
  grid-area: deckNaBoMass;
`
const DeckImage = styled.div`
  grid-area: deckImage;
`
const Img = styled.img`
  max-width: 100%;
  height: auto;
`

const Date = ({
  saveToDb,
  errors,
  data,
  updateTpopkontr,
}: {
  saveToDb: () => void,
  errors: Object,
  data: Object,
  updateTpopkontr: () => void,
}) => {
  const row = get(data, 'tpopkontrById')

  return (
    <Container>
      <DeckApArtLabel>Deckung üperprüfte Art</DeckApArtLabel>
      <DeckApArtVal>
        <TextField
          key={`${row.id}deckungApArt`}
          value={row.deckungApArt}
          type="number"
          saveToDb={value =>
            saveToDb({
              row,
              field: 'deckungApArt',
              value,
              updateTpopkontr,
            })
          }
          error={errors.deckungApArt}
        />
      </DeckApArtVal>
      <DeckApArtMass>%</DeckApArtMass>
      <DeckNaBoLabel>Flächenanteil nackter Boden</DeckNaBoLabel>
      <DeckNaBoVal>
        <TextField
          key={`${row.id}deckungNackterBoden`}
          value={row.deckungNackterBoden}
          type="number"
          saveToDb={value =>
            saveToDb({
              row,
              field: 'deckungNackterBoden',
              value,
              updateTpopkontr,
            })
          }
          error={errors.deckungNackterBoden}
        />
      </DeckNaBoVal>
      <DeckNaBoMass>%</DeckNaBoMass>
      <DeckImage>
        <Img src={anteilImg} alt="Flächen-Anteile" />
      </DeckImage>
    </Container>
  )
}

export default Date
