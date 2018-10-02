// @flow
import { graphql } from 'react-apollo'

import query from './beobNichtBeurteiltForMap'

export default graphql(query, {
  options: ({ ap, apIsActiveInMap }) => ({
    ap,
    apIsActiveInMap,
  }),
  name: 'dataBeobNichtBeurteiltForMap',
})
