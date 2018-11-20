// @flow
import React, { lazy, Suspense, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import Button from '@material-ui/core/Button'
import ArrowBack from '@material-ui/icons/ArrowBack'
import compose from 'recompose/compose'
import { withApollo } from 'react-apollo'

import ErrorBoundary from '../shared/ErrorBoundary'
import Fallback from '../shared/Fallback'
import withLocalData from './withLocalData'
import setTreeKey from './setTreeKey'
import historyContext from '../../historyContext'

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

const enhance = compose(
  withApollo,
  withLocalData,
)

const Print = ({
  localData,
  client,
}: {
  localData: Object,
  client: Object,
}) => {
  const { history } = useContext(historyContext)

  const activeNodeArray = get(localData, 'tree.activeNodeArray')
  const showApberForAp =
    activeNodeArray.length === 7 &&
    activeNodeArray[4] === 'AP-Berichte' &&
    activeNodeArray[6] === 'print'
  const showApberForYear =
    activeNodeArray.length === 5 &&
    activeNodeArray[2] === 'AP-Berichte' &&
    activeNodeArray[4] === 'print'

  if (localData.error) return `Fehler: ${localData.error.message}`
  if (!showApberForAp && !showApberForYear) return null

  return (
    <ErrorBoundary>
      <Container>
        {(showApberForAp || showApberForYear) && (
          <Suspense fallback={<Fallback />}>
            <BackButton
              variant="outlined"
              onClick={() => {
                history.goBack()
                if (history.location.state === undefined) {
                  // happens when print was the initial page opened
                  // so nowhere to go back to
                  const newActiveNodeArray = [...activeNodeArray]
                  newActiveNodeArray.pop()
                  client.mutate({
                    mutation: setTreeKey,
                    variables: {
                      value: newActiveNodeArray,
                      tree: 'tree',
                      key: 'activeNodeArray',
                    },
                  })
                  window.location.reload(false)
                }
              }}
            >
              <StyledArrowBack />
              zurück
            </BackButton>
            {showApberForAp && (
              <ApberForApFromAp activeNodeArray={activeNodeArray} />
            )}
            {showApberForYear && (
              <ApberForYear activeNodeArray={activeNodeArray} />
            )}
          </Suspense>
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Print)
