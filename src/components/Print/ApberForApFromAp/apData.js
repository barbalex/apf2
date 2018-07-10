// @flow
import { graphql } from 'react-apollo'
import get from 'lodash/get'

import apData from './apData.graphql'
import getActiveNodes from '../../../modules/getActiveNodes'

export default graphql(apData, {
  options: ({
    apberData,
    activeNodeArray,
    apId: apIdPassed,
  }:{
    apberData: Object,
    activeNodeArray: Array<String>,
    apId: String,
  }) => {
    let apId
    if (apIdPassed) {
      apId = apIdPassed
    } else {
      const { ap: apIdFromActiveNodes } = getActiveNodes(activeNodeArray)
      apId = apIdFromActiveNodes
    }
    const jahr = get(apberData, 'apberById.jahr', 0)
    const variables = { apId, jahr }
    return { variables }
  },
  name: 'apData',
}
)

