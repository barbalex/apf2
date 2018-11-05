// @flow
import React, { lazy, Suspense } from 'react'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import Button from '@material-ui/core/Button'
import ArrowBack from '@material-ui/icons/ArrowBack'
import app from 'ampersand-app'

import ErrorBoundary from '../shared/ErrorBoundary'
import Fallback from '../shared/Fallback'
import dataGql from './data'
import setTreeKey from './setTreeKey'

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

const Print = () => (
  <Query query={dataGql}>
    {({ error, data }) => {
      if (error) return `Fehler: ${error.message}`

      const activeNodeArray = get(data, 'tree.activeNodeArray')
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
                <BackButton
                  variant="outlined"
                  onClick={() => {
                    app.history.goBack()
                    if (app.history.location.state === undefined) {
                      // happens when print was the initial page opened
                      // so nowhere to go back to
                      const newActiveNodeArray = [...activeNodeArray]
                      newActiveNodeArray.pop()
                      app.client.mutate({
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
    }}
  </Query>
)

export default Print
