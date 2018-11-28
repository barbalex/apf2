// @flow
import React, { lazy, Suspense, useContext } from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import ArrowBack from '@material-ui/icons/ArrowBack'
import { getSnapshot } from 'mobx-state-tree'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../shared/ErrorBoundary'
import Fallback from '../shared/Fallback'
import mobxStoreContext from '../../mobxStoreContext'

const Container = styled.div`
  background-color: #eee;
  /*
  * need defined height and overflow
  * to make the pages scrollable in UI
  * is removed in print
  */
  overflow-y: auto;
  height: 100vh;

  @media print {
    /* remove grey backgrond set for nice UI */
    background-color: #fff;
    height: auto;
    overflow: visible;
  }
`
const BackButton = styled(Button)`
  position: absolute !important;
  top: 10px;
  left: 10px;
  @media print {
    display: none !important;
  }
`
const StyledArrowBack = styled(ArrowBack)`
  font-size: 18px !important;
  margin-left: -7px;
  padding-right: 4px;
`

const ApberForApFromAp = lazy(() => import('./ApberForApFromAp'))
const ApberForYear = lazy(() => import('./ApberForYear'))

const Print = () => {
  const mobxStore = useContext(mobxStoreContext)
  const { history, historyGoBack, setTreeKey, tree } = mobxStore
  const { activeNodeArray } = tree
  const showApberForAp =
    activeNodeArray.length === 7 &&
    activeNodeArray[4] === 'AP-Berichte' &&
    activeNodeArray[6] === 'print'
  const showApberForYear =
    activeNodeArray.length === 5 &&
    activeNodeArray[2] === 'AP-Berichte' &&
    activeNodeArray[4] === 'print'

  if (!showApberForAp && !showApberForYear) return null

  return (
    <ErrorBoundary>
      <Container>
        {(showApberForAp || showApberForYear) && (
          <Suspense fallback={<Fallback />}>
            <BackButton variant="outlined" onClick={historyGoBack}>
              <StyledArrowBack />
              zurück
            </BackButton>
            {showApberForAp && <ApberForApFromAp />}
            {showApberForYear && <ApberForYear />}
          </Suspense>
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Print)
