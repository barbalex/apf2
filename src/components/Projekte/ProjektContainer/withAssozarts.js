// @flow
import { graphql } from 'react-apollo'

import query from './assozarts.graphql'
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
        isAp: variables.isAp,
        ap: variables.ap,
      },
    }
  },
  name: 'dataAssozarts',
})
