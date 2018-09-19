// @flow
import { graphql } from 'react-apollo'

import query from './adresses.graphql'
import buildVariables from './variables'

export default graphql(query, {
  options: ({ dataLocal, treeName, nodeFilterState }) => {
    const variables = buildVariables({
      data: dataLocal,
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
