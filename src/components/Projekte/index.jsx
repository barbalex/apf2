import React, { useContext } from 'react'
import styled from '@emotion/styled'
import intersection from 'lodash/intersection'
import { observer } from 'mobx-react-lite'
import { useLocation } from 'react-router-dom'

import queryString from 'query-string'

// when Karte was loaded async, it did not load,
// but only in production!
import ProjektContainer from './ProjektContainer'
import storeContext from '../../storeContext'
import StyledSplitPane from '../shared/StyledSplitPane'
// import AppRenderer from '../../AppRenderer'
import appBaseUrl from '../../modules/appBaseUrl'
import inIframe from '../../modules/inIframe'
import useSearchParamsState from '../../modules/useSearchParamsState'
import isMobilePhone from '../../modules/isMobilePhone'
import ApFilterController from './ApFilterController'

const isInIframe = inIframe()

const Container = styled.div`
  height: 100%;
  position: relative;

  @media print {
    height: auto !important;
    overflow: visible !important;
    display: block;
  }
`
const StyledIframe = styled.iframe`
  border: none;
`

const tree2TabValues = ['tree2', 'daten2', 'filter2', 'karte2']

const Projekte = () => {
  const { pathname, search } = useLocation()
  const store = useContext(storeContext)
  const { isPrint } = store
  const { tree2Src } = store.tree

  const [projekteTabs] = useSearchParamsState(
    'projekteTabs',
    isMobilePhone() ? ['tree'] : ['tree', 'daten'],
  )
  const tree2Tabs = intersection(tree2TabValues, projekteTabs)

  let iFrameSrc = tree2Src
  if (!tree2Src) {
    // build search string for iframe
    const iFrameSearch = queryString.parse(search)
    // need to alter projekteTabs:
    if (Array.isArray(iFrameSearch.projekteTabs)) {
      iFrameSearch.projekteTabs = iFrameSearch.projekteTabs
        // - remove non-tree2 values
        .filter((t) => t.includes('2'))
        // - rewrite tree2 values to tree values
        .map((t) => t.replace('2', ''))
    } else if (iFrameSearch.projekteTabs) {
      iFrameSearch.projekteTabs = [iFrameSearch.projekteTabs]
        // - remove non-tree2 values
        .filter((t) => t.includes('2'))
        // - rewrite tree2 values to tree values
        .map((t) => t.replace('2', ''))
    }
    const newSearch = queryString.stringify(iFrameSearch)
    // pass this via src to iframe
    iFrameSrc = `${appBaseUrl().slice(0, -1)}${pathname}?${newSearch}`
  }

  if (isInIframe) {
    // inside iframe app bar should be hidden
    return (
      <Container>
        {tree2Tabs.length === 0 || isPrint ? (
          <ProjektContainer />
        ) : (
          <StyledSplitPane split="vertical" defaultSize="50%">
            <ProjektContainer />
            <StyledIframe
              src={iFrameSrc}
              title="tree2"
              width="100%"
              height="100%"
            />
          </StyledSplitPane>
        )}
      </Container>
    )
  }

  return (
    <>
      <ApFilterController />
      <Container>
        {tree2Tabs.length === 0 || isPrint ? (
          <ProjektContainer />
        ) : (
          <StyledSplitPane split="vertical" defaultSize="50%">
            <ProjektContainer />
            <StyledIframe
              src={iFrameSrc}
              title="tree2"
              width="100%"
              height="100%"
            />
          </StyledSplitPane>
        )}
      </Container>
    </>
  )
}

export default observer(Projekte)
