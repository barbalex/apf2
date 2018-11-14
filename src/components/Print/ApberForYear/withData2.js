// @flow
import { graphql } from 'react-apollo'
import get from 'lodash/get'

import query from './data1'
import getActiveNodes from '../../../modules/getActiveNodes'

export default graphql(query, {
  options: ({ activeNodeArray, data1 }) => {
    const { projekt: projektId } = getActiveNodes(activeNodeArray)
    const jahr = get(data1, 'apberuebersichtById.jahr', 0)

    return {
      variables: {
        projektId,
        jahr,
      },
    }
  },
  name: 'data2',
})
