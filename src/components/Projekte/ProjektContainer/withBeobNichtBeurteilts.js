// @flow
import { graphql } from 'react-apollo'

import query from './beobNichtBeurteilts.graphql'

export default graphql(query, {
  options: ({ isAp, ap }) => ({
    isAp,
    ap,
  }),
  name: 'dataBeobNichtBeurteilts',
})
