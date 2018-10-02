// @flow
import { graphql } from 'react-apollo'

import query from './users'

export default graphql(query, {
  name: 'dataUsers',
})
