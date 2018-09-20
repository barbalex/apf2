// @flow
import { graphql } from 'react-apollo'

import query from './tpopfeldkontrs.graphql'

export default graphql(query, {
  options: ({ isTpop, tpop }) => ({
    isTpop,
    tpop,
  }),
  name: 'dataTpopfeldkontrs',
})
