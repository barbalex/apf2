// @flow
import { graphql } from 'react-apollo'

import query from './data'

export default graphql(query, {
  options: ({ apId, startJahr }) => ({
    variables: {
      apId,
      startJahr,
    },
  }),
  name: 'data',
})
