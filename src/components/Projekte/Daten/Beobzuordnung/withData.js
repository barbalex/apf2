// @flow
import { graphql } from 'react-apollo'

import query from './data.graphql'

export default graphql(query, {
  options: ({ id }) => {
    return {
      variables: {
        id,
      },
    }
  },
  name: 'data',
})
