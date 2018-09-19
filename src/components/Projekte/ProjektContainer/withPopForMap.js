// @flow
import { graphql } from 'react-apollo'

import query from './popForMap.graphql'
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
        apIsActiveInMap: variables.apIsActiveInMap,
        ap: variables.ap,
      },
    }
  },
  name: 'dataPopForMap',
})
