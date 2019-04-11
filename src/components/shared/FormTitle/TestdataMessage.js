import React, { useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'

import constants from '../../../modules/constants'
import storeContext from '../../../storeContext'

const Div = styled.div`
  color: #c8e6c9;
  padding: 10px 10px 0 10px;
`

const TestdataMessage = ({ treeName, apId }) => {
  const store = useContext(storeContext)
  const tree = store[treeName]
  const apIdFromTree = get(tree, 'activeNodes.ap')
  const apIdUsed = apIdFromTree || apId
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
