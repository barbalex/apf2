// @flow
import { graphql } from 'react-apollo'

import query from './popmassnbers.graphql'
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
        isPop: variables.isPop,
        pop: variables.pop,
      },
    }
  },
  name: 'dataPopmassnbers',
})
