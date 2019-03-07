import React, { useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'

import constants from '../../../modules/constants'
import mobxStoreContext from '../../../mobxStoreContext'

const Div = styled.div`
  color: #c8e6c9;
  padding: 10px 10px 0 10px;
`

const TestdataMessage = ({
  treeName,
  apId,
}: {
  treeName: string,
  apId: string,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const tree = mobxStore[treeName]
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
