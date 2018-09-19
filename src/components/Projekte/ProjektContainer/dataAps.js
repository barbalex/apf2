// @flow
import { graphql } from 'react-apollo'

import query from './dataAps.graphql'
import buildVariables from './variables'

export default graphql(query, {
  options: ({ data1, treeName, nodeFilterState }) => {
    const variables = buildVariables({
      data: data1,
      treeName,
      nodeFilter: nodeFilterState.state[treeName],
    })

    return {
      variables: {
        isProjekt: variables.isProjekt,
        apFilter: variables.apFilter,
      },
    }
  },
  name: 'dataAps',
})
