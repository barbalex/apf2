import React, { useContext, useMemo } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import intersection from 'lodash/intersection'
import { Outlet } from 'react-router-dom'
import { useParams, useLocation } from 'react-router-dom'

import Karte from './Karte'
import TreeContainer from './TreeContainer'
import Exporte from './Exporte'
import Filter from './Filter'
import storeContext from '../../storeContext'
import StyledSplitPane from '../shared/StyledSplitPane'
import useSearchParamsState from '../../modules/useSearchParamsState'
import isMobilePhone from '../../modules/isMobilePhone'

const Container = styled.div`
  height: 100%;
  position: relative;

  @media print {
    display: block;
    height: auto !important;
  }
`
const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const ProjektContainer = () => {
  const { projId, apberUebersichtId, apberId } = useParams()
  const { pathname } = useLocation()

  const store = useContext(storeContext)
  const { isPrint } = store
  // react hooks 'exhaustive-deps' rule wants to move treeTabValues into own useMemo
  // to prevent it from causing unnessecary renders
  // BUT: this prevents necessary renders: clicking tabs does not cause re-render!
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const treeTabValues = [
    'tree',
    'daten',
    'filter',
    'karte',
    ...(projId ? ['exporte'] : []),
  ]

  const [projekteTabs] = useSearchParamsState(
    'projekteTabs',
    isMobilePhone() ? ['tree'] : ['tree', 'daten'],
  )

  const treeTabs = useMemo(
    () => intersection(treeTabValues, projekteTabs),
    [projekteTabs, treeTabValues],
  )

  const showApberForArt = apberId && pathname.endsWith('print')
  const showApberForAll = apberUebersichtId && pathname.endsWith('print')

  const elObj = {
    tree: (
      <InnerContainer>
        <TreeContainer />
      </InnerContainer>
    ),
    daten: (
      <InnerContainer>
        <Outlet />
      </InnerContainer>
    ),
    filter: (
      <InnerContainer>
        <Filter />
      </InnerContainer>
    ),
    karte: (
      <InnerContainer>
        <Karte />
      </InnerContainer>
    ),
    exporte: (
      <InnerContainer>
        <Exporte />
      </InnerContainer>
    ),
  }

  const paneSize = treeTabs[0] === 'tree' ? '33%' : '50%'

  // console.log('ProjektContainer', {
  //   isPrint,
  //   treeTabs,
  // })

  if (isPrint) {
    return <Outlet />
  }

  const overflow = showApberForAll || showApberForArt ? 'auto' : 'hidden'

  if (treeTabs.length < 2) {
    // return WITH split pane
    // otherwise height is wrong
    // and opening / closing tabs is slow
    // add empty div to prevent split-pane from
    // missing a second div
    return (
      <Container>
        <StyledSplitPane split="vertical" size="100%" maxSize={-10}>
          {elObj[treeTabs[0]]}
          <></>
        </StyledSplitPane>
      </Container>
    )
  }

  if (treeTabs.length === 2) {
    return (
      <Container>
        <StyledSplitPane
          split="vertical"
          size={paneSize}
          maxSize={-10}
          overflow={overflow}
        >
          {elObj[treeTabs[0]]}
          {elObj[treeTabs[1]]}
        </StyledSplitPane>
      </Container>
    )
  }

  if (treeTabs.length === 3) {
    return (
      <Container>
        <StyledSplitPane split="vertical" size="33%" maxSize={-10}>
          {elObj[treeTabs[0]]}
          <StyledSplitPane split="vertical" size="50%" maxSize={-10}>
            {elObj[treeTabs[1]]}
            {elObj[treeTabs[2]]}
          </StyledSplitPane>
        </StyledSplitPane>
      </Container>
    )
  }

  if (treeTabs.length === 4) {
    return (
      <Container>
        <StyledSplitPane split="vertical" size="25%" maxSize={-10}>
          {elObj[treeTabs[0]]}
          <StyledSplitPane split="vertical" size="33%" maxSize={-10}>
            {elObj[treeTabs[1]]}
            <StyledSplitPane split="vertical" size="50%" maxSize={-10}>
              {elObj[treeTabs[2]]}
              {elObj[treeTabs[3]]}
            </StyledSplitPane>
          </StyledSplitPane>
        </StyledSplitPane>
      </Container>
    )
  }

  if (treeTabs.length === 5) {
    return (
      <Container>
        <StyledSplitPane split="vertical" size="20%" maxSize={-10}>
          {elObj[treeTabs[0]]}
          <StyledSplitPane split="vertical" size="25%" maxSize={-10}>
            {elObj[treeTabs[1]]}
            <StyledSplitPane split="vertical" size="33%" maxSize={-10}>
              {elObj[treeTabs[2]]}
              <StyledSplitPane split="vertical" size="50%" maxSize={-10}>
                {elObj[treeTabs[3]]}
                {elObj[treeTabs[4]]}
              </StyledSplitPane>
            </StyledSplitPane>
          </StyledSplitPane>
        </StyledSplitPane>
      </Container>
    )
  }

  return null
}

export default observer(ProjektContainer)
