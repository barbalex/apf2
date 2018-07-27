// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import Measure from 'react-measure'

import AutoComplete from '../../../shared/Autocomplete'

const Area = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  break-inside: avoid;
`
const Container = styled(Area)`
  grid-area: headdata;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas:
    'popLabel popVal popVal'
    'tpopLabel tpopVal tpopVal'
    'koordLabel koordVal koordVal'
    'tpopNrLabel tpopNrVal statusVal'
    'bearbLabel bearbVal bearbVal';
  grid-column-gap: 10px;
  div:nth-child(n + 3) {
    padding-top: 10px;
  }
`
const Label = styled.div`
  font-weight: 700;
`
const PopLabel = styled(Label)`
  grid-area: popLabel;
`
const PopVal = styled.div`
  grid-area: popVal;
`
const TpopLabel = styled(Label)`
  grid-area: tpopLabel;
`
const TpopVal = styled.div`
  grid-area: tpopVal;
`
const KoordLabel = styled(Label)`
  grid-area: koordLabel;
`
const KoordVal = styled.div`
  grid-area: koordVal;
`
const TpopNrLabel = styled(Label)`
  grid-area: tpopNrLabel;
`
const TpopNrVal = styled.div`
  grid-area: tpopNrVal;
`
const BearbLabel = styled(Label)`
  grid-area: bearbLabel;
`
const BearbVal = styled.div`
  grid-area: bearbVal;
  > div {
    margin-top: -5px;
    padding-bottom: 0;
  }
`
const StatusLabel = styled(Label)`
  grid-area: statusVal;
`

const Headdata = ({
  saveToDb,
  errors,
  data,
  updateTpopkontr,
  setHeaddataHeight,
}: {
  saveToDb: () => void,
  errors: Object,
  data: Object,
  updateTpopkontr: () => void,
  setHeaddataHeight: () => void,
}) => {
  const row = get(data, 'tpopkontrById', {})
  let adressenWerte = get(data, 'allAdresses.nodes', [])
  adressenWerte = sortBy(adressenWerte, 'name')
  adressenWerte = adressenWerte.map(el => ({
    id: el.id,
    value: el.name,
  }))
  const statusValue = get(row, 'tpopByTpopId.status', '')
  const status = [200, 201, 202].includes(statusValue)
    ? 'angesiedelt'
    : 'natürlich'

  return (
    <Measure
      bounds
      onResize={contentRect => {
        setHeaddataHeight(contentRect.bounds.height)
      }}
    >
      {({ measureRef }) => (
        <Container innerRef={measureRef}>
          <PopLabel>Population</PopLabel>
          <PopVal>{get(row, 'tpopByTpopId.popByPopId.name', '')}</PopVal>
          <TpopLabel>Teilpopulation</TpopLabel>
          <TpopVal>{get(row, 'tpopByTpopId.flurname', '')}</TpopVal>
          <KoordLabel>Koordinaten</KoordLabel>
          <KoordVal>{`${get(row, 'tpopByTpopId.x', '')} / ${get(
            row,
            'tpopByTpopId.y'
          )}`}</KoordVal>
          <TpopNrLabel>Teilpop.Nr.</TpopNrLabel>
          <TpopNrVal>{`${get(row, 'tpopByTpopId.popByPopId.nr', '')}.${get(
            row,
            'tpopByTpopId.nr'
          )}`}</TpopNrVal>
          <BearbLabel>BeobachterIn</BearbLabel>
          <BearbVal>
            <AutoComplete
              key={`${row.id}bearbeiter`}
              label=""
              value={get(row, 'adresseByBearbeiter.name', '')}
              objects={adressenWerte}
              saveToDb={value =>
                saveToDb({
                  row,
                  field: 'bearbeiter',
                  value,
                  updateTpopkontr,
                })
              }
              error={errors.bearbeiter}
            />
          </BearbVal>
          <StatusLabel>{status}</StatusLabel>
        </Container>
      )}
    </Measure>
  )
}

export default Headdata
