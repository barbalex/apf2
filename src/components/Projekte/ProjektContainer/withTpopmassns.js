// @flow
import { graphql } from 'react-apollo'

import query from './tpopmassns.graphql'

export default graphql(query, {
  options: ({ isTpop, tpop }) => ({
    isTpop,
    tpop,
  }),
  name: 'dataTpopmassns',
})
