// @flow
import { graphql } from 'react-apollo'

import query from './beobNichtBeurteiltForMapMarkers.graphql'
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
        apId: variables.apId,
        apIsActiveInMap: variables.apIsActiveInMap,
      },
    }
  },
  name: 'dataBeobNichtBeurteiltForMapMarkers',
})
