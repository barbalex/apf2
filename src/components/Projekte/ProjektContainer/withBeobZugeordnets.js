// @flow
import { graphql } from 'react-apollo'

import query from './beobZugeordnets'

export default graphql(query, {
  options: ({ isTpop, tpop }) => ({
    isTpop,
    tpop,
  }),
  name: 'dataBeobZugeordnets',
})
