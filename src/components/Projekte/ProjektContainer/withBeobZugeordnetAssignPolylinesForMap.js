// @flow
import { graphql } from 'react-apollo'

import query from './beobZugeordnetAssignPolylinesForMap'

export default graphql(query, {
  options: ({ ap, beobZugeordnetAssignPolylinesIsActiveInMap }) => ({
    ap,
    beobZugeordnetAssignPolylinesIsActiveInMap,
  }),
  name: 'dataBeobZugeordnetAssignPolylinesForMap',
})
