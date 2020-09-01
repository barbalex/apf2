import React, { useContext } from 'react'
import styled from 'styled-components'

import constants from '../../../modules/constants'
import storeContext from '../../../storeContext'

const Div = styled.div`
  color: #c8e6c9;
  padding: 0 10px;
  margin-top: -10px;
`

const TestdataMessage = ({ treeName, apId }) => {
  const store = useContext(storeContext)
  if (!treeName) {
    console.log('TestdataMessage was not passed a treeName, bailing out!')
    return
  }
  const { apIdInActiveNodeArray } = store[treeName]
  const apIdUsed = apIdInActiveNodeArray || apId
  const isTestAp = apIdUsed && constants.testAps.includes(apIdUsed)

  if (isTestAp) {
    return (
      <Div data-id="testdata-message">
        Das ist ein Test-Aktionsplan. Sie können alles ausprobieren!
      </Div>
    )
  }
  return null
}

export default TestdataMessage
