// @flow
import { graphql } from 'react-apollo'

import query from './ziels'

export default graphql(query, {
  options: ({ isAp, ap }) => ({
    isAp,
    ap,
  }),
  name: 'dataZiels',
})
