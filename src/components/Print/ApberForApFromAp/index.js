// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import ErrorBoundary from '../../shared/ErrorBoundary'
import apData from './apData'
import apberData from './apberData'
import ApberForAp from '../ApberForAp'
import getActiveNodes from '../../../modules/getActiveNodes'

const LoadingContainer = styled.div`
  padding: 15px;
  height: 100%;
`
const Container = styled.div`
  /* this part is for when page preview is shown */
  /* Divide single pages with some space and center all pages horizontally */
  /* will be removed in @media print */
  margin: ${props => props.issubreport ? '0' : '1cm auto'};
  margin-left: ${props => props.issubreport ? '-0.75cm !important' : '1cm auto'};
  /* Define a white paper background that sticks out from the darker overall background */
  background: ${props => props.issubreport ? 'rgba(0, 0, 0, 0)' : '#fff'};
  /* Show a drop shadow beneath each page */
  box-shadow: ${props => props.issubreport ? 'unset' : '0 4px 5px rgba(75, 75, 75, 0.2)'};

  /* set dimensions */
  /*height: 29.7cm;*/
  width: 21cm;

  overflow-y: visible;

  @media print {
    /* this is when it is actually printed */
    height: inherit;
    width: inherit;

    margin: 0 !important;
    padding: ${props => props.issubreport ? '0' : '0.5cm !important'};
    overflow-y: hidden !important;
    /* try this */
    page-break-inside: avoid !important;
    page-break-before: avoid !important;
    page-break-after: avoid !important;
    
    box-shadow: unset;
    overflow: hidden;
  }
`

const enhance = compose(
  withState('yearOfFirstTpopber', 'setYearOfFirstTpopber', null),
  withHandlers({
    onSetYearOfFirstTpopber: ({
      yearOfFirstTpopber,
      setYearOfFirstTpopber
    }) => year => {
      if (year !== yearOfFirstTpopber) {
        setYearOfFirstTpopber(year)
      }
    }
  }),
  apberData,
  apData,
)

const ApberForApFromAp = ({
  activeNodeArray,
  apberData,
  apData,
  yearOfFirstTpopber,
  onSetYearOfFirstTpopber,
}:{
  activeNodeArray: Array<String>,
  apberData: Object,
  apData: Object,
  yearOfFirstTpopber: Number,
  onSetYearOfFirstTpopber: () => void,
}) => {
  if (apData.loading)
    return (
      <Container>
        <LoadingContainer>Lade...</LoadingContainer>
      </Container>
    )
  if (apberData.error) return `Fehler: ${apberData.error.message}`
  if (apData.error) return `Fehler: ${apData.error.message}`

  const jahr = get(apberData, 'apberById.jahr')
  const { ap: apId } = getActiveNodes(activeNodeArray)

  return (
    <ErrorBoundary>
      <ApberForAp
        apId={apId}
        jahr={jahr}
        apData={apData}
      />
    </ErrorBoundary>
  )
}

export default enhance(ApberForApFromAp)
