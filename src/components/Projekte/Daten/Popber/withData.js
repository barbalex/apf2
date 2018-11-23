// @flow
import { graphql } from 'react-apollo'

import query from './data'

export default graphql(query, {
  options: ({ mobxStore, treeName }) => {
    const { activeNodeArray } = mobxStore[treeName]
    const id =
      activeNodeArray.length > 7
        ? activeNodeArray[7]
        : '99999999-9999-9999-9999-999999999999'

    return {
      variables: {
        id,
      },
    }
  },
  name: 'data',
})
