// @flow
import { graphql } from 'react-apollo'

import query from './data'

export default graphql(query, {
  options: ({ mobxStore, treeName }) => {
    const { activeNodeArray } = mobxStore[treeName]
    const id = activeNodeArray[activeNodeArray.length - 1]

    return {
      variables: {
        id,
      },
    }
  },
  name: 'data',
})
