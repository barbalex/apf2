// @flow
import { graphql } from 'react-apollo'

import query from './beobNichtZuzuordnenForMap'

export default graphql(query, {
  options: ({ ap, beobNichtZuzuordnenIsActiveInMap }) => ({
    ap,
    beobNichtZuzuordnenIsActiveInMap,
  }),
  name: 'dataBeobNichtZuzuordnenForMap',
})
