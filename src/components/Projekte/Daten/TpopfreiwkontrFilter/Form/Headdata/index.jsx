import { memo, useCallback, useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'

import { Select } from '../../../../../shared/Select.jsx'
import { MobxContext } from '../../../../../../mobxContext.js'
import { query } from './query.js'
import { Error } from '../../../../../shared/Error.jsx'

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
  div:nth-of-type(n + 3) {
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

export const Headdata = memo(
  observer(({ row, activeTab }) => {
    const store = useContext(MobxContext)
    const { dataFilterSetValue } = store.tree
    const { data, loading, error } = useQuery(query)

    const saveToDb = useCallback(
      async (event) => {
        dataFilterSetValue({
          table: 'tpopfreiwkontr',
          key: 'bearbeiter',
          value: event.target.value,
          index: activeTab,
        })
      },
      [activeTab, dataFilterSetValue],
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
  }),
)
