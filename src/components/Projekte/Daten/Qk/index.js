import React, { useCallback, useContext, useState } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import ErrorBoundary from 'react-error-boundary'
import { useQuery } from '@apollo/react-hooks'

import FormTitle from '../../../shared/FormTitle'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import storeContext from '../../../../storeContext'
import Qk from './Qk'
import Choose from './Choose'
import query from './query'
import queryQk from './queryQk'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background-color: ${props => (props.showfilter ? '#ffd3a7' : 'unset')};
`
const FieldsContainer = styled.div`
  overflow: hidden !important;
  height: calc(100vh - 64px - 43px);
  fieldset {
    padding-right: 30px;
  }
`
const LoadingContainer = styled.div`
  padding: 8px;
`

const QkForm = ({ treeName }) => {
  const store = useContext(storeContext)
  const { urlQuery, setUrlQuery } = store
  const { activeNodeArray } = store[treeName]
  const apId = activeNodeArray[3]

  const { data: dataQk, loading: loadingQk, error: errorQk } = useQuery(
    queryQk,
    { variables: { apId }, fetchPolicy: 'no-cache' },
  )
  const qkNameQueries = Object.fromEntries(
    (get(dataQk, 'allQks.nodes') || []).map(n => [
      n.name,
      get(n, 'apqksByQkName.totalCount') === 1,
    ]),
  )

  const { data, loading, refetch } = useQuery(query, { variables: { apId } })
  const qkCount = loading ? '...' : get(data, 'allQks.totalCount')
  const apqkCount = loading ? '...' : get(data, 'allApqks.totalCount')

  const [tab, setTab] = useState(get(urlQuery, 'tpqkb', 'qk'))
  const onChangeTab = useCallback(
    (event, value) => {
      setUrlQueryValue({
        key: 'qkTab',
        value,
        urlQuery,
        setUrlQuery,
      })
      setTab(value)
    },
    [setUrlQuery, urlQuery],
  )

  console.log('QK TOP', { qkNameQueries, nodes: get(dataQk, 'allQks.nodes') })

  if (errorQk) return `Fehler: ${errorQk.message}`
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Qualitätskontrollen" />
        <FieldsContainer>
          <Tabs
            value={tab}
            onChange={onChangeTab}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="ausführen" value="qk" data-id="qk" />
            <Tab
              label={`auswählen${
                !!qkCount ? ` (${apqkCount}/${qkCount})` : ''
              }`}
              value="waehlen"
              data-id="waehlen"
            />
          </Tabs>
          {tab === 'qk' ? (
            <>
              {loadingQk ? (
                <LoadingContainer>Lade Daten...</LoadingContainer>
              ) : (
                <Qk
                  key={qkCount}
                  treeName={treeName}
                  qkNameQueries={qkNameQueries}
                />
              )}
            </>
          ) : (
            <Choose treeName={treeName} refetchTab={refetch} />
          )}
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(QkForm)
