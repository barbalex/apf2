// @flow
import { graphql } from 'react-apollo'

import query from './tpopfreiwkontrs'

export default graphql(query, {
  options: ({ isTpop, tpop }) => ({
    isTpop,
    tpop,
  }),
  name: 'dataTpopfreiwkontrs',
})
