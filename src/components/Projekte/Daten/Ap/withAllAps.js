// @flow
import { graphql } from 'react-apollo'

import query from './allAps.graphql'

export default graphql(query, {
  name: 'dataAllAps',
})
