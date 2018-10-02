// @flow
import { graphql } from 'react-apollo'

import query from './assozarts'

export default graphql(query, {
  options: ({ isAp, ap }) => ({
    isAp,
    ap,
  }),
  name: 'dataAssozarts',
})
