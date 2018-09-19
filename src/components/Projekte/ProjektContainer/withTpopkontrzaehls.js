// @flow
import { graphql } from 'react-apollo'

import query from './tpopkontrzaehls.graphql'
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
        isTpopkontr: variables.isTpopkontr,
        tpopkontr: variables.tpopkontr,
      },
    }
  },
  name: 'dataTpopkontrzaehls',
})
