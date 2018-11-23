// @flow
import { graphql } from 'react-apollo'

import query from './data'

export default graphql(query, {
  options: ({ mobxStore, treeName }) => ({
    variables: {
      id: mobxStore[treeName].activeNodeArray[2],
    },
  }),
  name: 'data',
})
