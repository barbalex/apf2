// @flow
import { graphql } from 'react-apollo'

import query from './data'

export default graphql(query, {
  options: ({ username }) => ({
    variables: {
      name: username,
    },
  }),
  name: 'data',
})
