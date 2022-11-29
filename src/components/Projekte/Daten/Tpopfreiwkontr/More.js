import React from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import TextField from '../../../shared/TextField2'
import RadioButton from '../../../shared/RadioButton'
import veghoeheImg from './veghoehe.png'

const Area = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  break-inside: avoid;
`
const Container = styled(Area)`
  grid-area: more;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-column-gap: 5px;
  grid-template-areas:
    'moreFlLabel moreFlLabel moreFlLabel moreFlVal moreFlVal moreFlVal moreFlVal moreFlVal moreFlVal moreFlVal moreFlVal moreFlMeasure'
    'jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0'
    'jungPflLabel1 jungPflVal1 jungPflLabel2 jungPflVal2 . . . . . . . .'
    'veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0'
    'veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheMaxLabel veghoeheMaxLabel veghoeheMaxLabel veghoeheMaxVal veghoeheMaxVal'
    'veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheMittLabel veghoeheMittLabel veghoeheMittLabel veghoeheMittVal veghoeheMittVal'
    'veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheMinLabel veghoeheMinLabel veghoeheMinLabel . .';
  align-items: center;
  @media print {
    grid-template-areas:
      'moreFlLabel moreFlLabel moreFlLabel moreFlVal moreFlVal moreFlVal moreFlVal moreFlVal moreFlVal moreFlVal moreFlVal moreFlMeasure'
      'jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0 jungPflLabel0'
      'jungPflLabel1 jungPflVal1 jungPflLabel2 jungPflVal2 . . . . . . . .'
      'veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0 veghoeheLabel0'
      'veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheMaxLabel veghoeheMaxLabel veghoeheMaxLabel veghoeheMaxLabel veghoeheMaxLabel veghoeheMaxVal veghoeheMaxVal veghoeheMaxVal'
      'veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheMittLabel veghoeheMittLabel veghoeheMittLabel veghoeheMittLabel veghoeheMittLabel veghoeheMittVal veghoeheMittVal veghoeheMittVal'
      'veghoeheImg veghoeheImg veghoeheImg veghoeheImg veghoeheMinLabel veghoeheMinLabel veghoeheMinLabel veghoeheMinLabel veghoeheMinLabel . . .';
  }
`
const MoreFlLabel = styled.div`
  grid-area: moreFlLabel;
  font-weight: 700;
`
const MoreFlVal = styled.div`
  grid-area: moreFlVal;
  > div > div > input {
    @media print {
      font-size: 11px !important;
    }
  }
`
const MoreFlMeasure = styled.div`
  grid-area: moreFlMeasure;
`
const JungPflLabel0 = styled.div`
  grid-area: jungPflLabel0;
  font-weight: 700;
  padding-bottom: 5px;
`
const JungPflLabel1 = styled.div`
  grid-area: jungPflLabel1;
  margin-top: -15px;
`
const JungPflVal1 = styled.div`
  grid-area: jungPflVal1;
`
const JungPflLabel2 = styled.div`
  grid-area: jungPflLabel2;
  margin-top: -15px;
`
const JungPflVal2 = styled.div`
  grid-area: jungPflVal2;
`
const VeghoeheLabel0 = styled.div`
  grid-area: veghoeheLabel0;
  font-weight: 700;
`
const VeghoeheMaxLabel = styled.div`
  grid-area: veghoeheMaxLabel;
  align-self: start;
  margin-top: 10px;
  @media print {
    margin-top: 5px;
  }
`
const VeghoeheMaxVal = styled.div`
  grid-area: veghoeheMaxVal;
  align-self: start;
  margin-top: -11px;
  @media print {
    margin-top: -16px;
  }
  > div > div > input {
    @media print {
      font-size: 11px !important;
    }
  }
`
const VeghoeheMittLabel = styled.div`
  grid-area: veghoeheMittLabel;
  align-self: start;
  margin-top: 30px;
  @media print {
    margin-top: 3px;
  }
`
const VeghoeheMittVal = styled.div`
  grid-area: veghoeheMittVal;
  align-self: start;
  margin-top: 8px;
  @media print {
    margin-top: -19px;
  }
  > div > div > input {
    @media print {
      font-size: 11px !important;
    }
  }
`
const VeghoeheMinLabel = styled.div`
  grid-area: veghoeheMinLabel;
  align-self: start;
  margin-top: -11px;
  @media print {
    margin-top: -13px;
  }
`
// https://www.voorhoede.nl/en/blog/say-no-to-image-reflow
const VeghoeheImg = styled.div`
  grid-area: veghoeheImg;
  display: block;
  position: relative;
  height: 0;
  overflow: hidden;
  padding-bottom: 86.813%;
`
const Img = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-width: inherit;
`

const More = ({ saveToDb, row, errors }) => (
  <Container>
    <MoreFlLabel>Überprüfte Fläche</MoreFlLabel>
    <MoreFlVal>
      <TextField
        key={`${row.id}flaecheUeberprueft`}
        name="flaecheUeberprueft"
        row={row}
        type="number"
        saveToDb={saveToDb}
        errors={errors}
      />
    </MoreFlVal>
    <MoreFlMeasure>
      m<sup>2</sup>
    </MoreFlMeasure>
    <JungPflLabel0>Werden junge neben alten Pflanzen beobachtet?</JungPflLabel0>
    <JungPflLabel1>ja</JungPflLabel1>
    <JungPflVal1 data-id="jungpflanzenVorhanden_true">
      <RadioButton
        key={`${row.id}${row.jungpflanzenVorhanden}jungpflanzenVorhanden1`}
        name="jungpflanzenVorhanden"
        value={row.jungpflanzenVorhanden}
        saveToDb={saveToDb}
      />
    </JungPflVal1>
    <JungPflLabel2>nein</JungPflLabel2>
    <JungPflVal2 data-id="jungpflanzenVorhanden_false">
      <RadioButton
        key={`${row.id}jungpflanzenVorhanden2`}
        name="jungpflanzenVorhandenNein"
        value={row.jungpflanzenVorhanden === false}
        saveToDb={() => {
          const fakeEvent = {
            target: { name: 'jungpflanzenVorhanden', value: false },
          }
          saveToDb(fakeEvent)
        }}
        error={errors.jungpflanzenVorhanden}
      />
    </JungPflVal2>
    <VeghoeheLabel0>Vegetationshöhe</VeghoeheLabel0>
    <VeghoeheImg>
      <Img src={veghoeheImg} alt="Flächen-Anteile" />
    </VeghoeheImg>
    <VeghoeheMaxLabel>Maximum (cm)</VeghoeheMaxLabel>
    <VeghoeheMaxVal>
      <TextField
        key={`${row.id}vegetationshoeheMaximum`}
        name="vegetationshoeheMaximum"
        row={row}
        type="number"
        saveToDb={saveToDb}
        errors={errors}
      />
    </VeghoeheMaxVal>
    <VeghoeheMittLabel>Mittel (cm)</VeghoeheMittLabel>
    <VeghoeheMittVal>
      <TextField
        key={`${row.id}vegetationshoeheMittel`}
        name="vegetationshoeheMittel"
        row={row}
        type="number"
        saveToDb={saveToDb}
        errors={errors}
      />
    </VeghoeheMittVal>
    <VeghoeheMinLabel>(Minimum)</VeghoeheMinLabel>
  </Container>
)

export default observer(More)
