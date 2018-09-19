// @flow
import { graphql } from 'react-apollo'

import query from './localData.graphql'

export default graphql(query, {
  name: 'dataLocal',
})
