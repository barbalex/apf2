// @flow
import { graphql } from 'react-apollo'

import apberById from './apberById'

export default graphql(apberById, {
  options: ({
    activeNodeArray,
    activeNodes,
    apberId: apberIdPassed,
  }: {
    activeNodeArray: Array<String>,
    activeNodes: Array<Array<String>>,
    apberId: String,
  }) => {
    let apberId
    if (apberIdPassed) {
      apberId = apberIdPassed
    } else {
      const { apber: apberIdFromActiveNodes } = activeNodes
      apberId = apberIdFromActiveNodes
    }
    const variables = { apberId }
    return { variables }
  },
  name: 'apberData',
})
