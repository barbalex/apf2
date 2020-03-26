import React, { useContext, useCallback, useState } from 'react'
import styled from 'styled-components'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import ErrorBoundary from 'react-error-boundary'

import Ap from './Ap'
import Auswertung from './Auswertung'
import FormTitle from '../../../shared/FormTitle'
import storeContext from '../../../../storeContext'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  padding-top: 0;
  overflow: auto !important;
  height: 100%;
`
const StyledTabs = styled(Tabs)`
  margin-bottom: 10px;
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`

const ApTabs = ({ treeName }) => {
  const store = useContext(storeContext)
  const { urlQuery, setUrlQuery } = store
  const { activeNodeArray } = store[treeName]

  let id =
    activeNodeArray.length > 3
      ? activeNodeArray[3]
      : '99999999-9999-9999-9999-999999999999'

  const [tab, setTab] = useState(get(urlQuery, 'apTab', 'ap'))
  const onChangeTab = useCallback(
    (event, value) => {
      setUrlQueryValue({
        key: 'apTab',
        value,
        urlQuery,
        setUrlQuery,
      })
      setTab(value)
    },
    [setUrlQuery, urlQuery],
  )

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle apId={id} title="Aktionsplan" treeName={treeName} />
        <FieldsContainer>
          <StyledTabs
            value={tab}
            onChange={onChangeTab}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <StyledTab label="AP" value="ap" data-id="ap" />
            <StyledTab
              label="Auswertung"
              value="auswertung"
              data-id="auswertung"
            />
          </StyledTabs>
          {tab === 'ap' && <Ap treeName={treeName} id={id} />}
          {tab === 'auswertung' && <Auswertung id={id} />}
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(ApTabs)
