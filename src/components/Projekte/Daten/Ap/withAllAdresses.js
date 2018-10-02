// @flow
import { graphql } from 'react-apollo'

import query from './allAdresses'

export default graphql(query, {
  name: 'dataAllAdresses',
})
