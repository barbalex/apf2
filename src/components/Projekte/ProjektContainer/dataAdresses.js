// @flow
import { graphql } from 'react-apollo'

import query from './dataAdresses.graphql'
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
        isWerteListen: variables.isWerteListen,
        isAdresse: variables.isAdresse,
      },
    }
  },
  name: 'dataAdresses',
})
