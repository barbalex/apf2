// @flow
import { graphql } from 'react-apollo'

import query from './data1'

export default graphql(query, {
  options: ({ activeNodeArray, activeNodes }) => {
    const { apberuebersicht: apberuebersichtId } = activeNodes
    return {
      variables: {
        apberuebersichtId,
      },
    }
  },
  name: 'data1',
})
