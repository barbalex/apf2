import React, { useCallback, useContext, useState } from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import ErrorBoundary from 'react-error-boundary'

import FormTitle from '../../../shared/FormTitle'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import storeContext from '../../../../storeContext'
import Qk from './Qk'
import Choose from './Choose'

const Container = styled.div`
  height: ${props =>
    props.showfilter ? 'calc(100vh - 145px)' : 'calc(100vh - 64px)'};
  display: flex;
  flex-direction: column;
  background-color: ${props => (props.showfilter ? '#ffd3a7' : 'unset')};
`
const FieldsContainer = styled.div`
  overflow: hidden !important;
  height: 100%;
  fieldset {
    padding-right: 30px;
  }
`

const QkForm = ({ treeName, showFilter = false }) => {
  const store = useContext(storeContext)
  const { urlQuery, setUrlQuery } = store

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

  return (
    <ErrorBoundary>
      <Container showfilter={showFilter}>
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
            <Tab label="auswählen" value="waehlen" data-id="waehlen" />
          </Tabs>
          {tab === 'qk' ? (
            <Qk treeName={treeName} />
          ) : (
            <Choose treeName={treeName} />
          )}
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(QkForm)
