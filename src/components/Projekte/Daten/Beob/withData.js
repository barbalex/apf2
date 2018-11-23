// @flow
import { graphql } from 'react-apollo'

import query from './data'

export default graphql(query, {
  options: ({ mobxStore, treeName }) => {
    console.log('Beob, withData:', { mobxStore, treeName })
    const { activeNodeArray } = mobxStore[treeName]
    console.log('Beob, withData:', { activeNodeArray })
    const id = activeNodeArray[activeNodeArray.length - 1]

    return {
      variables: {
        id,
      },
    }
  },
  name: 'data',
})
