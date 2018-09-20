// @flow
import { graphql } from 'react-apollo'

import query from './aparts.graphql'

export default graphql(query, {
  options: ({ isAp, ap }) => ({
    isAp,
    ap,
  }),
  name: 'dataAparts',
})
