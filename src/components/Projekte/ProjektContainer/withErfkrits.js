// @flow
import { graphql } from 'react-apollo'

import query from './erfkrits.graphql'

export default graphql(query, {
  options: ({ isAp, ap }) => ({
    isAp,
    ap,
  }),
  name: 'dataErfkrits',
})
