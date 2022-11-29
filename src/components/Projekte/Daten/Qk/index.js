import React, { useCallback, useContext, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import SimpleBar from 'simplebar-react'

import FormTitle from '../../../shared/FormTitle'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import storeContext from '../../../../storeContext'
import Qk from './Qk'
import Choose from './Choose'
import queryQk from './queryQk'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import Spinner from '../../../shared/Spinner'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${(props) => (props.showfilter ? '#ffd3a7' : 'unset')};
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const TabContent = styled.div`
  height: 100%;
  fieldset {
    padding-right: 30px;
  }
`

const QkForm = ({ treeName }) => {
  const store = useContext(storeContext)
  const { urlQuery, setUrlQuery } = store
  const { activeNodeArray } = store[treeName]
  const apId = activeNodeArray[3]

  const { data, loading, error, refetch } = useQuery(queryQk, {
    variables: { apId },
    fetchPolicy: 'no-cache',
  })
  /**
   * DO NOT get allQks.nodes.apqksByQkName.totalCount
   * AS THIS IS NEVER UPDATED
   */
  const allQks = data?.allQks.nodes ?? []
  const qks = allQks.filter(
    (qk) => !!(data?.allApqks?.nodes ?? []).find((no) => no.qkName === qk.name),
  )
  const qkNameQueries = Object.fromEntries(
    allQks.map((n) => [
      n.name,
      !!(data?.allApqks?.nodes ?? []).find((no) => no.qkName === n.name),
    ]),
  )

  const qkCount = loading ? '...' : data?.allQks?.totalCount
  const apqkCount = loading ? '...' : data?.allApqks?.totalCount

  const [tab, setTab] = useState(urlQuery?.qkTab ?? 'qk')
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

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Qualitätskontrollen" treeName={treeName} />
        <Tabs
          value={tab}
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab label="ausführen" value="qk" data-id="qk" />
          <StyledTab
            label={`auswählen${qkCount ? ` (${apqkCount}/${qkCount})` : ''}`}
            value="waehlen"
            data-id="waehlen"
          />
        </Tabs>
        <div style={{ overflowY: 'auto' }}>
          <TabContent>
            <SimpleBar
              style={{
                maxHeight: '100%',
                height: '100%',
              }}
            >
              {tab === 'qk' ? (
                <>
                  {loading ? (
                    <Spinner />
                  ) : (
                    <Qk
                      key={qkCount}
                      treeName={treeName}
                      qkNameQueries={qkNameQueries}
                      qks={qks}
                    />
                  )}
                </>
              ) : (
                <Choose treeName={treeName} refetchTab={refetch} />
              )}
            </SimpleBar>
          </TabContent>
        </div>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(QkForm)
