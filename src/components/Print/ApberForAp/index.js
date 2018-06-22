// @flow
import React, { Component, createRef } from 'react'
import styled from 'styled-components'
import { Query } from 'react-apollo'
//import get from 'lodash/get'

import ErrorBoundary from '../../shared/ErrorBoundary'
import getActiveNodes from '../../../modules/getActiveNodes'
import dataGql from './data.graphql'

const Container = styled.div`
  /* this part is for when page preview is shown */
  /* Divide single pages with some space and center all pages horizontally */
  /* will be removed in @media print */
  margin: 1cm auto;
  /* Define a white paper background that sticks out from the darker overall background */
  background: #fff;
  /* Show a drop shadow beneath each page */
  box-shadow: 0 4px 5px rgba(75, 75, 75, 0.2);

  /* set dimensions */
  height: 29.7cm;
  width: 21cm;

  overflow-y: visible;

  @media print {
    /* this is when it is actually printed */
    height: inherit;
    width: inherit;

    margin: 0 !important;
    padding: 0.5cm !important;
    overflow-y: hidden !important;
    /* try this */
    page-break-inside: avoid !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;
  }
`
const LoadingContainer = styled.div`
  padding: 15px;
  height: 100%;
`

type Props = {
  activeNodeArray: Array<String>,
  dimensions: Object,
  errors: Object,
}

class ApberPrint extends Component<Props> {
  constructor(props) {
    super(props)
    this.container = createRef()
  }

  render() {
    const { activeNodeArray } = this.props
    const { /*projekt: projId, */ap: apId, apber: apberId } = getActiveNodes(activeNodeArray)

    return (
      <Query
        query={dataGql}
        variables={{ apId, apberId }}
      >
        {({ loading, error, data }) => {
          if (loading)
            return (
              <Container>
                <LoadingContainer>Lade...</LoadingContainer>
              </Container>
            )
          if (error) return `Fehler: ${error.message}`

          console.log('ApberForAp:', {data})

          return (
            <ErrorBoundary>
              <Container innerRef={this.container}>
                <div>AP-Bericht pro AP Druckversion</div>
              </Container>
            </ErrorBoundary>
          )
        }}
      </Query>
    )
  }
}

export default ApberPrint
