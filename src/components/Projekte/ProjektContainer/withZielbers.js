// @flow
import { graphql } from 'react-apollo'

import query from './zielbers.graphql'
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
        isZiel: variables.isZiel,
        ziel: variables.ziel,
      },
    }
  },
  name: 'dataZielbers',
})
