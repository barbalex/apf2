// @flow
import { graphql } from 'react-apollo'
import get from 'lodash/get'

import query from './data2'

export default graphql(query, {
  options: ({ activeNodeArray, data1, activeNodes }) => {
    const { projekt: projektId } = activeNodes
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
