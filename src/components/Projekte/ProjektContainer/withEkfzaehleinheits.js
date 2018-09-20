// @flow
import { graphql } from 'react-apollo'

import query from './ekfzaehleinheits.graphql'

export default graphql(query, {
  options: ({ isAp, ap }) => ({
    isAp,
    ap,
  }),
  name: 'dataEkfzaehleinheits',
})
