// @flow
import { graphql } from 'react-apollo'

import query from './apbers.graphql'

export default graphql(query, {
  options: ({ isAp, ap }) => ({
    isAp,
    ap,
  }),
  name: 'dataApbers',
})
