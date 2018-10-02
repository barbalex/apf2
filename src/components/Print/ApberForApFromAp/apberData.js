// @flow
import { graphql } from 'react-apollo'

import apberById from './apberById'
import getActiveNodes from '../../../modules/getActiveNodes'

export default graphql(apberById, {
  options: ({
    activeNodeArray,
    apberId: apberIdPassed,
  }: {
    activeNodeArray: Array<String>,
    apberId: String,
  }) => {
    let apberId
    if (apberIdPassed) {
      apberId = apberIdPassed
    } else {
      const { apber: apberIdFromActiveNodes } = getActiveNodes(activeNodeArray)
      apberId = apberIdFromActiveNodes
    }
    const variables = { apberId }
    return { variables }
  },
  name: 'apberData',
})
