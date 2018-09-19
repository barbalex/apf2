// @flow
import { graphql } from 'react-apollo'

import query from './tpops.graphql'
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
        tpopFilter: variables.tpopFilter,
      },
    }
  },
  name: 'dataTpops',
})
