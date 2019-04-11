import { graphql } from 'react-apollo'

import query from './localData'

export default graphql(query, {
  name: 'localData',
})
