// @flow
import { graphql } from 'react-apollo'

import query from './idealbiotops.graphql'

export default graphql(query, {
  options: ({ isAp, ap }) => ({
    isAp,
    ap,
  }),
  name: 'dataIdealbiotops',
})
