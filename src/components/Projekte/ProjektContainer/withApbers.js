// @flow
import { graphql } from 'react-apollo'

import query from './apbers'

export default graphql(query, {
  options: ({ isAp, ap }) => ({
    isAp,
    ap,
  }),
  name: 'dataApbers',
})
