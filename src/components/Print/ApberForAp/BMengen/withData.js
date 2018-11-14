// @flow
import { graphql } from 'react-apollo'

import query from './data'

export default graphql(query, {
  options: ({ apId, jahr }) => ({
    variables: {
      apId,
      jahr,
    },
  }),
  name: 'data',
})
