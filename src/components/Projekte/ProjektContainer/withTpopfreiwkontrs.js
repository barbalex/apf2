// @flow
import { graphql } from 'react-apollo'

import query from './tpopfreiwkontrs.graphql'

export default graphql(query, {
  options: ({ isTpop, tpop }) => ({
    isTpop,
    tpop,
  }),
  name: 'dataTpopfreiwkontrs',
})
