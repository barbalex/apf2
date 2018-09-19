// @flow
import { graphql } from 'react-apollo'

import query from './aps.graphql'
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
        isProjekt: variables.isProjekt,
        apFilter: variables.apFilter,
      },
    }
  },
  name: 'dataAps',
})
