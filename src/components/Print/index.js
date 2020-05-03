import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import ArrowBack from '@material-ui/icons/ArrowBack'
import { observer } from 'mobx-react-lite'

//import Fallback from '../shared/Fallback'
import storeContext from '../../storeContext'
import ApberForApFromAp from './ApberForApFromAp'
import ApberForYear from './ApberForYear'
import ErrorBoundary from '../shared/ErrorBoundary'

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

const Print = () => {
  const store = useContext(storeContext)
  const { tree } = store
  const { activeNodeArray } = tree
  const showApberForAp =
    activeNodeArray.length === 7 &&
    activeNodeArray[4] === 'AP-Berichte' &&
    activeNodeArray[6] === 'print'
  const showApberForYear =
    activeNodeArray.length === 5 &&
    activeNodeArray[2] === 'AP-Berichte' &&
    activeNodeArray[4] === 'print'

  const onClickBack = useCallback(
    () => typeof window !== 'undefined' && window.history.back(),
    [],
  )

  if (!showApberForAp && !showApberForYear) return null

  /**
   * ReactDOMServer does not yet support Suspense
   */

  return (
    <ErrorBoundary>
      <Container>
        <BackButton variant="outlined" onClick={onClickBack}>
          <StyledArrowBack />
          zurück
        </BackButton>
        {showApberForAp && <ApberForApFromAp />}
        {showApberForYear && <ApberForYear />}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Print)
