// @flow
import { graphql } from 'react-apollo'

import query from './beobAssignLines.graphql'
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
        projId: variables.projId,
        isProjekt: variables.isProjekt,
        apId: variables.apId,
        isAp: variables.isAp,
      },
    }
  },
  name: 'dataBeobAssignLines',
})
