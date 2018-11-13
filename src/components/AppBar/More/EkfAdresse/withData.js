// @flow
import { graphql } from 'react-apollo'

import query from './data'

export default graphql(query, {
  name: 'data',
})
