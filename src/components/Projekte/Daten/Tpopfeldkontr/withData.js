// @flow
import { graphql } from 'react-apollo'

import query from './dataQuery'

export default graphql(query, {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
  name: 'data',
})
