import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'

import Select from '../../../../shared/Select'
import storeContext from '../../../../../storeContext'
import queryAdresses from './queryAdresses'
import Error from '../../../../shared/Error'

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

const Headdata = ({ pop, tpop, row, treeName }) => {
  const store = useContext(storeContext)
  const { dataFilterSetValue } = store
  const { data, loading, error } = useQuery(queryAdresses)

  const saveToDb = useCallback(
    async (event) =>
      dataFilterSetValue({
        treeName,
        table: 'tpopfreiwkontr',
        key: 'bearbeiter',
        value: event.target.value,
      }),
    [dataFilterSetValue, treeName],
  )

  const statusValue = tpop?.status ?? ''
  const status = [200, 201, 202].includes(statusValue)
    ? 'angesiedelt'
    : 'natürlich'

  if (error) return <Error error={error} />
  return (
    <Container>
      <PopLabel>Population</PopLabel>
      <PopVal>{pop?.name ?? ''}</PopVal>
      <TpopLabel>Teilpopulation</TpopLabel>
      <TpopVal>{tpop?.flurname ?? ''}</TpopVal>
      <KoordLabel>Koordinaten</KoordLabel>
      <KoordVal>{`${tpop?.lv95X ?? ''} / ${tpop?.lv95Y ?? ''}`}</KoordVal>
      <TpopNrLabel>Teilpop.Nr.</TpopNrLabel>
      <TpopNrVal>{`${pop?.nr ?? ''}.${tpop?.nr ?? ''}`}</TpopNrVal>
      <BearbLabel>BeobachterIn</BearbLabel>
      <BearbVal>
        <Select
          key={`${row.id}bearbeiter`}
          name="bearbeiter"
          value={row.bearbeiter}
          field="bearbeiter"
          options={data?.allAdresses?.nodes ?? []}
          loading={loading}
          saveToDb={saveToDb}
        />
      </BearbVal>
      <StatusLabel>{status}</StatusLabel>
    </Container>
  )
}

export default observer(Headdata)
