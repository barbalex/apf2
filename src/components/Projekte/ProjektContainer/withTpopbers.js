// @flow
import { graphql } from 'react-apollo'

import query from './tpopbers'

export default graphql(query, {
  options: ({ isTpop, tpop }) => ({
    isTpop,
    tpop,
  }),
  name: 'dataTpopbers',
})
