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
import Files from '../../../shared/Files'
import storeContext from '../../../../storeContext'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const StyledTabs = styled(Tabs)`
  margin-bottom: 10px;
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const FilesContainer = styled.div`
  padding: 10px;
  overflow-y: auto !important;
  height: calc(100% - 20px);
`

const ApTabs = ({ treeName }) => {
  const store = useContext(storeContext)
  const { urlQuery, setUrlQuery } = store
  const { activeNodeArray, datenWidth } = store[treeName]

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
          <StyledTab label="Dateien" value="dateien" data-id="dateien" />
        </StyledTabs>
        {tab === 'ap' && <Ap treeName={treeName} id={id} />}
        {tab === 'auswertung' && <Auswertung id={id} />}
        {tab === 'dateien' && (
          <FilesContainer data-width={datenWidth}>
            <Files parentId={id} parent="ap" />
          </FilesContainer>
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(ApTabs)
