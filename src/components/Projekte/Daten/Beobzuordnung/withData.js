// @flow
import { graphql } from 'react-apollo'

import query from './data.graphql'

export default graphql(query, {
  options: ({ id, apId }) => {
    return {
      variables: {
        id,
        apId,
      },
    }
  },
  name: 'data',
})
