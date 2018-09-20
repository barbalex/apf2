// @flow
import { graphql } from 'react-apollo'

import query from './beobNichtBeurteiltForMap.graphql'

export default graphql(query, {
  options: ({ ap, apIsActiveInMap }) => ({
    ap,
    apIsActiveInMap,
  }),
  name: 'dataBeobNichtBeurteiltForMap',
})
