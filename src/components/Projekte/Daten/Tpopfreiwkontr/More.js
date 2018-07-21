// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'

import TextField from '../../../shared/TextField'
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
`
const Img = styled.img`
  max-width: 100%;
  height: auto;
`
const MoreFlLabel = styled.div`
  grid-area: moreFlLabel;
  font-weight: 700;
`
const MoreFlVal = styled.div`
  grid-area: moreFlVal;
`
const MoreFlMeasure = styled.div`
  grid-area: moreFlMeasure;
`
const JungPflLabel0 = styled.div`
  grid-area: jungPflLabel0;
  font-weight: 700;
`
const JungPflLabel1 = styled.div`
  grid-area: jungPflLabel1;
`
const JungPflVal1 = styled.div`
  grid-area: jungPflVal1;
`
const JungPflLabel2 = styled.div`
  grid-area: jungPflLabel2;
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
`
const VeghoeheMaxVal = styled.div`
  grid-area: veghoeheMaxVal;
  align-self: start;
  margin-top: -11px;
`
const VeghoeheMittLabel = styled.div`
  grid-area: veghoeheMittLabel;
  align-self: start;
  margin-top: 30px;
`
const VeghoeheMittVal = styled.div`
  grid-area: veghoeheMittVal;
  align-self: start;
  margin-top: 8px;
`
const VeghoeheMinLabel = styled.div`
  grid-area: veghoeheMinLabel;
  align-self: start;
  margin-top: -11px;
`
const VeghoeheImg = styled.div`
  grid-area: veghoeheImg;
`

const More = ({
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
  const row = get(data, 'tpopkontrById', {})

  return (
    <Container>
      <MoreFlLabel>Überprüfte Fläche</MoreFlLabel>
      <MoreFlVal>
        <TextField
          key={`${row.id}flaecheUeberprueft`}
          value={row.flaecheUeberprueft}
          type="number"
          saveToDb={value =>
            saveToDb({
              row,
              field: 'flaecheUeberprueft',
              value,
              updateTpopkontr,
            })
          }
          error={errors.flaecheUeberprueft}
        />
      </MoreFlVal>
      <MoreFlMeasure>
        m<sup>2</sup>
      </MoreFlMeasure>
      <JungPflLabel0>
        Werden junge neben alten Pflanzen beobachtet?
      </JungPflLabel0>
      <JungPflLabel1>ja</JungPflLabel1>
      <JungPflVal1>
        <RadioButton
          key={`${row.id}jungpflanzenVorhanden1`}
          value={row.jungpflanzenVorhanden}
          saveToDb={value =>
            saveToDb({
              row,
              field: 'jungpflanzenVorhanden',
              value,
              updateTpopkontr,
            })
          }
          error={errors.jungpflanzenVorhanden}
        />
      </JungPflVal1>
      <JungPflLabel2>nein</JungPflLabel2>
      <JungPflVal2>
        <RadioButton
          key={`${row.id}jungpflanzenVorhanden2`}
          value={!row.jungpflanzenVorhanden}
          saveToDb={value =>
            saveToDb({
              row,
              field: 'jungpflanzenVorhanden',
              value: !value,
              updateTpopkontr,
            })
          }
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
          value={row.vegetationshoeheMaximum}
          type="number"
          saveToDb={value =>
            saveToDb({
              row,
              field: 'vegetationshoeheMaximum',
              value,
              updateTpopkontr,
            })
          }
          error={errors.vegetationshoeheMaximum}
        />
      </VeghoeheMaxVal>
      <VeghoeheMittLabel>Mittel (cm)</VeghoeheMittLabel>
      <VeghoeheMittVal>
        <TextField
          key={`${row.id}vegetationshoeheMittel`}
          value={row.vegetationshoeheMittel}
          type="number"
          saveToDb={value =>
            saveToDb({
              row,
              field: 'vegetationshoeheMittel',
              value,
              updateTpopkontr,
            })
          }
          error={errors.vegetationshoeheMittel}
        />
      </VeghoeheMittVal>
      <VeghoeheMinLabel>(Minimum)</VeghoeheMinLabel>
    </Container>
  )
}

export default More
