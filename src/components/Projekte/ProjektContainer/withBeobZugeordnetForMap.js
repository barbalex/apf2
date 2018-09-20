// @flow
import { graphql } from 'react-apollo'

import query from './beobZugeordnetForMap.graphql'

export default graphql(query, {
  options: ({ ap, apIsActiveInMap }) => ({
    ap,
    apIsActiveInMap,
  }),
  name: 'dataBeobZugeordnetForMap',
})
