// @flow
import { graphql } from 'react-apollo'

import query from './popForMap'

export default graphql(query, {
  options: ({ apIsActiveInMap, ap }) => ({
    apIsActiveInMap,
    ap,
  }),
  name: 'dataPopForMap',
})
