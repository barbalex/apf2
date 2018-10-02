// @flow
import { graphql } from 'react-apollo'

import query from './allAps'

export default graphql(query, {
  name: 'dataAllAps',
})
