import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import TextField from '../../../shared/TextField2'
import anteilImg from './anteil.png'

const Area = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  break-inside: avoid;
`
const Container = styled(Area)`
  grid-area: cover;
  display: grid;
  grid-template-columns: 4fr 3fr 15px;
  grid-template-areas:
    'deckApArtLabel deckApArtVal deckApArtMass'
    'deckNaBoLabel deckNaBoVal deckNaBoMass'
    'deckImage deckImage deckImage';
  grid-column-gap: 10px;
`
const Label = styled.div`
  font-weight: 700;
`
const DeckApArtLabel = styled(Label)`
  grid-area: deckApArtLabel;
`
const DeckApArtVal = styled.div`
  grid-area: deckApArtVal;
  > div {
    margin-top: -25px;
    padding-bottom: 5px !important;
  }
  > div > div > input {
    @media print {
      font-size: 11px !important;
    }
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
    padding-bottom: 5px !important;
  }
  > div > div > input {
    @media print {
      font-size: 11px !important;
    }
  }
`
const DeckNaBoMass = styled.div`
  grid-area: deckNaBoMass;
`
// https://www.voorhoede.nl/en/blog/say-no-to-image-reflow
const DeckImage = styled.div`
  grid-area: deckImage;
  display: block;
  position: relative;
  height: 0;
  overflow: hidden;
  padding-bottom: 59.061%;
`
const Img = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-width: inherit;
`

const Date = ({ saveToDb, row, errors }) => (
  <Container>
    <DeckApArtLabel>Deckung überprüfte Art</DeckApArtLabel>
    <DeckApArtVal>
      <TextField
        key={`${row.id}deckungApArt`}
        name="deckungApArt"
        row={row}
        type="number"
        saveToDb={saveToDb}
        errors={errors}
      />
    </DeckApArtVal>
    <DeckApArtMass>%</DeckApArtMass>
    <DeckNaBoLabel>Flächenanteil nackter Boden</DeckNaBoLabel>
    <DeckNaBoVal>
      <TextField
        key={`${row.id}deckungNackterBoden`}
        name="deckungNackterBoden"
        row={row}
        type="number"
        saveToDb={saveToDb}
        errors={errors}
      />
    </DeckNaBoVal>
    <DeckNaBoMass>%</DeckNaBoMass>
    <DeckImage>
      <Img src={anteilImg} alt="Flächen-Anteile" />
    </DeckImage>
  </Container>
)

export default observer(Date)
