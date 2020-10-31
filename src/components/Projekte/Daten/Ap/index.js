import React, { useContext, useCallback, useState } from 'react'
import styled from 'styled-components'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'

import Ap from './Ap'
import Auswertung from './Auswertung'
import FormTitle from '../../../shared/FormTitle'
import Files from '../../../shared/Files'
import storeContext from '../../../../storeContext'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import ErrorBoundary from '../../../shared/ErrorBoundary'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const StyledTab = styled(Tab)`
  text-transform: none !important;
`
const TabContent = styled.div`
  height: ${(props) =>
    `calc(100% - ${props['data-form-title-height']}px - 48px)`};
`

const ApTabs = ({ treeName }) => {
  const store = useContext(storeContext)
  const { urlQuery, setUrlQuery, appBarHeight } = store
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

  const [formTitleHeight, setFormTitleHeight] = useState(43)

  console.log('Ap, appBarHeight:', appBarHeight)

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={id}
          title="Aktionsplan"
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
          <StyledTab label="AP" value="ap" data-id="ap" />
          <StyledTab
            label="Auswertung"
            value="auswertung"
            data-id="auswertung"
          />
          <StyledTab label="Dateien" value="dateien" data-id="dateien" />
        </Tabs>
        <TabContent data-form-title-height={formTitleHeight}>
          {tab === 'ap' && <Ap treeName={treeName} id={id} />}
          {tab === 'auswertung' && <Auswertung id={id} />}
          {tab === 'dateien' && <Files parentId={id} parent="ap" />}
        </TabContent>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(ApTabs)
