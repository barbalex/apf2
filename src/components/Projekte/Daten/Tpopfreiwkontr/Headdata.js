// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import Measure from 'react-measure'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'

import Select from '../../../shared/Select'

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
  margin-top: 5px;
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

const enhance = compose(
  withHandlers({
    onResize: ({ setHeaddataHeight }) => contentRect => {
      setHeaddataHeight(contentRect.bounds.height)
    },
  }),
  onlyUpdateForKeys([
    'id',
    'bearbeiter',
    'errorsBearbeiter',
    'pop',
    'tpop',
    'adressenNodes',
  ]),
)

const Headdata = ({
  id,
  bearbeiter,
  errorsBearbeiter,
  pop,
  tpop,
  saveToDb,
  adressenNodes,
  row,
  updateTpopkontr,
  setHeaddataHeight,
  showFilter,
  onResize,
}: {
  id: string,
  bearbeiter: string,
  errorsBearbeiter: string,
  pop: Object,
  tpop: Object,
  saveToDb: () => void,
  adressenNodes: Array<Object>,
  row: Object,
  updateTpopkontr: () => void,
  setHeaddataHeight: () => void,
  showFilter: boolean,
  onResize: () => void,
}) => {
  let adressenWerte = sortBy(adressenNodes, 'name')
  adressenWerte = adressenWerte.map(el => ({
    value: el.id,
    label: el.name,
  }))
  const statusValue = get(tpop, 'status', '')
  const status = [200, 201, 202].includes(statusValue)
    ? 'angesiedelt'
    : 'natürlich'

  return (
    <Measure bounds onResize={onResize}>
      {({ measureRef }) => (
        <Container innerRef={measureRef}>
          <PopLabel>Population</PopLabel>
          <PopVal>{get(pop, 'name', '')}</PopVal>
          <TpopLabel>Teilpopulation</TpopLabel>
          <TpopVal>{get(tpop, 'flurname', '')}</TpopVal>
          <KoordLabel>Koordinaten</KoordLabel>
          <KoordVal>{`${get(tpop, 'x', '')} / ${get(tpop, 'y', '')}`}</KoordVal>
          <TpopNrLabel>Teilpop.Nr.</TpopNrLabel>
          <TpopNrVal>{`${get(pop, 'nr', '')}.${get(
            tpop,
            'nr',
            '',
          )}`}</TpopNrVal>
          <BearbLabel>BeobachterIn</BearbLabel>
          <BearbVal>
            <Select
              key={`${id}bearbeiter`}
              value={bearbeiter}
              field="bearbeiter"
              options={adressenWerte}
              saveToDb={value =>
                saveToDb({
                  row,
                  field: 'bearbeiter',
                  value,
                  updateTpopkontr,
                })
              }
              error={errorsBearbeiter}
            />
          </BearbVal>
          <StatusLabel>{status}</StatusLabel>
        </Container>
      )}
    </Measure>
  )
}

export default enhance(Headdata)
