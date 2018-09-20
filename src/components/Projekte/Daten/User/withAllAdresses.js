// @flow
import { graphql } from 'react-apollo'

import query from './allAdresses.graphql'

export default graphql(query, {
  name: 'dataAllAdresses',
})
