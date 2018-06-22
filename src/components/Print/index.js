// @flow
import React from 'react'
import styled from 'styled-components'
import Loadable from 'react-loadable'

import ErrorBoundary from '../shared/ErrorBoundary'
import Loading from '../shared/Loading'

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
  }
`

const ApberForAp = Loadable({
  loader: () => import('./ApberForAp'),
  loading: Loading,
})

const Print = ({
  activeNodeArray
}:{
  activeNodeArray: Array<String>
}) => {
  const showApberForAp = activeNodeArray.length === 7 &&
    activeNodeArray[4] === 'AP-Berichte' &&
    activeNodeArray[6] === 'print'

  return (
    <ErrorBoundary>
      <Container>
        {
          showApberForAp &&
          <ApberForAp
            activeNodeArray={activeNodeArray}
          />
        }
      </Container>
    </ErrorBoundary>
  )
}

export default Print
