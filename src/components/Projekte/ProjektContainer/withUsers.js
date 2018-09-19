// @flow
import { graphql } from 'react-apollo'

import query from './users.graphql'

export default graphql(query, {
  name: 'dataUsers',
})
