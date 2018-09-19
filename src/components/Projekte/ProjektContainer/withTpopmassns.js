// @flow
import { graphql } from 'react-apollo'

import query from './tpopmassns.graphql'
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
        isTpop: variables.isTpop,
        tpop: variables.tpop,
      },
    }
  },
  name: 'dataTpopmassns',
})
