// @flow
import React, { Component, createRef } from 'react'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import format from 'date-fns/format'

import ErrorBoundary from '../../shared/ErrorBoundary'
import getActiveNodes from '../../../modules/getActiveNodes'
import dataGql from './data.graphql'

const LoadingContainer = styled.div`
  padding: 15px;
  height: 100%;
`
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
const ContentContainer = styled.div`
  padding: 1.5cm;
  font-size: 14px;
`
const Header = styled.p`
  font-size: 12px;
`
const Title1 = styled.h2`
  font-size: 14px;
  font-weight: 800;
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

          console.log('ApberForAp, data:', data)

          return (
            <ErrorBoundary>
              <Container innerRef={this.container}>
                <ContentContainer>
                  <Header>
                    {
                    `Jahresbericht ${get(data, 'apById.apbersByApId.nodes[0].jahr', '(kein Jahr)')}, ${get(data, 'apById.aeEigenschaftenByArtId.artname')}, ${format(new Date(), 'DD.MM.YYYY')}`
                    }
                  </Header>
                  <Title1>{get(data, 'apById.aeEigenschaftenByArtId.artname')}</Title1>
                </ContentContainer>
              </Container>
            </ErrorBoundary>
          )
        }}
      </Query>
    )
  }
}

export default ApberPrint
