import React, { useCallback } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import styled from '@emotion/styled'
import { useQuery } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useParams } from 'react-router-dom'

import FormTitle from '../../../shared/FormTitle'
import Qk from './Qk'
import Choose from './Choose'
import queryQk from './queryQk'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import Spinner from '../../../shared/Spinner'
import useSearchParamsState from '../../../../modules/useSearchParamsState'

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

const QkForm = () => {
  const { apId } = useParams()

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

  const [tab, setTab] = useSearchParamsState('qkTab', 'qk')
  const onChangeTab = useCallback((event, value) => setTab(value), [setTab])

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Qualitätskontrollen" />
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
                    <Qk key={qkCount} qkNameQueries={qkNameQueries} qks={qks} />
                  )}
                </>
              ) : (
                <Choose refetchTab={refetch} />
              )}
            </SimpleBar>
          </TabContent>
        </div>
      </Container>
    </ErrorBoundary>
  )
}

export default QkForm
