// @flow
import { graphql } from 'react-apollo'

import query from './beobZugeordnetForMap.graphql'
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
        ap: variables.ap,
        apIsActiveInMap: variables.apIsActiveInMap,
      },
    }
  },
  name: 'dataBeobZugeordnetForMap',
})
