// @flow
import { graphql } from 'react-apollo'

import query from './bers'

export default graphql(query, {
  options: ({ isAp, ap }) => ({
    isAp,
    ap,
  }),
  name: 'dataBers',
})
