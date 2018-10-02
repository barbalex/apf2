// @flow
import { graphql } from 'react-apollo'

import query from './beobNichtZuzuordnenForMap'

export default graphql(query, {
  options: ({ ap, apIsActiveInMap }) => ({
    ap,
    apIsActiveInMap,
  }),
  name: 'dataBeobNichtZuzuordnenForMap',
})
