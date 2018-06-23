// @flow
import React, { Fragment } from 'react'
import styled from 'styled-components'
import Loadable from 'react-loadable'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import Button from '@material-ui/core/Button'
import app from 'ampersand-app'

import ErrorBoundary from '../shared/ErrorBoundary'
import Loading from '../shared/Loading'
import dataGql from './data.graphql'
import setTreeKey from './setTreeKey.graphql'

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
const BackButton = styled(Button)`
  position: absolute;
  top: 10px;
  left: 10px;
`

const ApberForAp = Loadable({
  loader: () => import('./ApberForAp'),
  loading: Loading,
})

const Print = () =>
  <Query query={dataGql} >
    {({ error, data }) => {
      if (error) return `Fehler: ${error.message}`

      const activeNodeArray = get(data, 'tree.activeNodeArray')
      const activeNodeArray2 = get(data, 'tree2.activeNodeArray')
      const showApberForAp = (activeNodeArray.length === 7 &&
        activeNodeArray[4] === 'AP-Berichte' &&
        activeNodeArray[6] === 'print') || (activeNodeArray2.length === 7 &&
          activeNodeArray2[4] === 'AP-Berichte' &&
          activeNodeArray2[6] === 'print'
        )
      if (!showApberForAp) return null

      return (
        <ErrorBoundary>
          <Container>
            {
              showApberForAp &&
              <Fragment>
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
                          key: 'activeNodeArray'
                        }
                      })
                      window.location.reload(false)
                    }
                  }}
                >
                  zurück
                </BackButton>
                <ApberForAp
                  activeNodeArray={activeNodeArray}
                />
              </Fragment>
            }
          </Container>
        </ErrorBoundary>
      )
    }}
  </Query>

export default Print
