import React, { useContext } from "react"
import styled from "styled-components"
import get from "lodash/get"
import { observer } from "mobx-react-lite"
import { useQuery } from "react-apollo-hooks"

import ErrorBoundary from "../../shared/ErrorBoundary"
import apQuery from "./apByIdJahr"
import apberQuery from "./apberById"
import ApberForAp from "../ApberForAp"
import storeContext from "../../../storeContext"

const LoadingContainer = styled.div`
  padding: 15px;
  height: 100%;
`
const Container = styled.div`
  /* this part is for when page preview is shown */
  /* Divide single pages with some space and center all pages horizontally */
  /* will be removed in @media print */
  margin: ${props => (props.issubreport ? "0" : "1cm auto")};
  margin-left: ${props =>
    props.issubreport ? "-0.75cm !important" : "1cm auto"};
  /* Define a white paper background that sticks out from the darker overall background */
  background: ${props => (props.issubreport ? "rgba(0, 0, 0, 0)" : "#fff")};
  /* Show a drop shadow beneath each page */
  box-shadow: ${props =>
    props.issubreport ? "unset" : "0 4px 5px rgba(75, 75, 75, 0.2)"};

  /* set dimensions */
  width: 21cm;

  overflow-y: visible;

  @media print {
    /* this is when it is actually printed */
    height: auto !important;
    overflow: visible !important;
    width: 21cm;

    margin: 0 !important;
    padding: ${props => (props.issubreport ? "0" : "0.5cm !important")};
    /*padding-left: 0 !important;*/

    box-shadow: unset;
  }
`

const ApberForApFromAp = ({ apberId: apberIdPassed, apId: apIdPassed }) => {
  const store = useContext(storeContext)
  const activeNodes = store.treeActiveNodes
  let apberId
  if (apberIdPassed) {
    apberId = apberIdPassed
  } else {
    const { apber: apberIdFromActiveNodes } = activeNodes
    apberId = apberIdFromActiveNodes
  }
  let apId
  if (apIdPassed) {
    apId = apIdPassed
  } else {
    const { ap: apIdFromActiveNodes } = activeNodes
    apId = apIdFromActiveNodes
  }

  const { data: apberData, error: apberDataError } = useQuery(apberQuery, {
    variables: {
      apberId,
    },
  })

  const jahr = get(apberData, "apberById.jahr", 0)

  const { data: apData, loading: apDataLoading, error: apDataError } = useQuery(
    apQuery,
    {
      variables: {
        apId,
        jahr,
      },
    }
  )

  if (apDataLoading) {
    return (
      <Container>
        <LoadingContainer>Lade...</LoadingContainer>
      </Container>
    )
  }
  if (apberDataError) return `Fehler: ${apberDataError.message}`
  if (apDataError) return `Fehler: ${apDataError.message}`

  return (
    <ErrorBoundary>
      <ApberForAp apId={apId} jahr={jahr} apData={apData} />
    </ErrorBoundary>
  )
}

export default observer(ApberForApFromAp)
