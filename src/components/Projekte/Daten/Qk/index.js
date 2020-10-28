import React, { useCallback, useContext, useState } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import styled from 'styled-components'
import get from 'lodash/get'
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

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background-color: ${(props) => (props.showfilter ? '#ffd3a7' : 'unset')};
`
const LoadingContainer = styled.div`
  height: calc(100vh - 64px);
  padding: 10px;
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const TabContent = styled.div`
  height: ${(props) =>
    `calc(100% - ${props['data-form-title-height']}px - 48px)`};
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
  const allQks = get(data, 'allQks.nodes') || []
  const qks = allQks.filter(
    (qk) =>
      !!(get(data, 'allApqks.nodes') || []).find((no) => no.qkName === qk.name),
  )
  const qkNameQueries = Object.fromEntries(
    allQks.map((n) => [
      n.name,
      !!(get(data, 'allApqks.nodes') || []).find((no) => no.qkName === n.name),
    ]),
  )

  const qkCount = loading ? '...' : get(data, 'allQks.totalCount')
  const apqkCount = loading ? '...' : get(data, 'allApqks.totalCount')

  const [tab, setTab] = useState(get(urlQuery, 'qkTab', 'qk'))
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

  const [formTitleHeight, setFormTitleHeight] = useState(43)

  if (error) {
    return (
      <LoadingContainer>
        {`Fehler beim Laden der Daten: ${error.message}`}
      </LoadingContainer>
    )
  }
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          title="Qualitätskontrollen"
          treeName={treeName}
          setFormTitleHeight={setFormTitleHeight}
        />
        <Tabs
          value={tab}
          onChange={onChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <StyledTab label="ausführen" value="qk" data-id="qk" />
          <StyledTab
            label={`auswählen${!!qkCount ? ` (${apqkCount}/${qkCount})` : ''}`}
            value="waehlen"
            data-id="waehlen"
          />
        </Tabs>
        <TabContent data-form-title-height={formTitleHeight}>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            {tab === 'qk' ? (
              <>
                {loading ? (
                  <LoadingContainer>Lade Daten...</LoadingContainer>
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
      </Container>
    </ErrorBoundary>
  )
}

export default observer(QkForm)
