// @flow
import { graphql } from 'react-apollo'

import query from './bers.graphql'

export default graphql(query, {
  options: ({ isAp, ap }) => ({
    isAp,
    ap,
  }),
  name: 'dataBers',
})
