import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'

import constants from '../../../modules/constants'

const Div = styled.div`
  color: #c8e6c9;
  padding: 10px 10px 0 10px;
`

const TestdataMessage = ({ tree, apId }: { tree: Object, apId: String }) => {
  const apIdFromTree = get(tree, 'activeNodes.ap')
  const apIdUsed = apIdFromTree || apId
  const isTestAp = apIdUsed && constants.testAps.includes(apIdUsed)
  if (isTestAp) {
    return (
      <Div>Das ist ein Test-Aktionsplan. Sie können alles ausprobieren!</Div>
    )
  }
  return null
}

export default TestdataMessage
