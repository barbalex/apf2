// @flow
import { graphql } from 'react-apollo'

import query from './tpopmassnbers.graphql'

export default graphql(query, {
  options: ({ isTpop, tpop }) => ({
    isTpop,
    tpop,
  }),
  name: 'dataTpopmassnbers',
})
