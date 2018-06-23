// @flow
import React from 'react'
import styled from 'styled-components'
import Loadable from 'react-loadable'
import { Query } from 'react-apollo'
import get from 'lodash/get'

import ErrorBoundary from '../shared/ErrorBoundary'
import Loading from '../shared/Loading'
import dataGql from './data.graphql'

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
              <ApberForAp
                activeNodeArray={activeNodeArray}
              />
            }
          </Container>
        </ErrorBoundary>
      )
    }}
  </Query>

export default Print
