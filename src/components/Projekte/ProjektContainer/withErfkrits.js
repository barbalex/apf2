// @flow
import { graphql } from 'react-apollo'

import query from './erfkrits'

export default graphql(query, {
  options: ({ isAp, ap }) => ({
    isAp,
    ap,
  }),
  name: 'dataErfkrits',
})
