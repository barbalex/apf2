import React, { useCallback, useContext } from 'react'
import styled from '@emotion/styled'
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

const Headdata = ({ row, treeName, activeTab }) => {
  const store = useContext(storeContext)
  const { dataFilterSetValue } = store
  const { data, loading, error } = useQuery(queryAdresses)

  const saveToDb = useCallback(
    async (event) => {
      console.log('Headdata setting:', { value: event.target.value })
      dataFilterSetValue({
        treeName,
        table: 'tpopfreiwkontr',
        key: 'bearbeiter',
        value: event.target.value,
        index: activeTab,
      })
    },
    [activeTab, dataFilterSetValue, treeName],
  )

  if (error) return <Error error={error} />
  return (
    <Container>
      <BearbLabel>BeobachterIn</BearbLabel>
      <BearbVal>
        <Select
          key={`${row?.id}${activeTab}bearbeiter`}
          name="bearbeiter"
          value={row?.bearbeiter}
          field="bearbeiter"
          options={data?.allAdresses?.nodes ?? []}
          loading={loading}
          saveToDb={saveToDb}
        />
      </BearbVal>
    </Container>
  )
}

export default observer(Headdata)
