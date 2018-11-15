// @flow
import { graphql } from 'react-apollo'

import query from './allAdressesQuery'

export default graphql(query, {
  name: 'dataAllAdresses',
})
