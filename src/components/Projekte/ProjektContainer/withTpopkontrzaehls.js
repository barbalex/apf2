// @flow
import { graphql } from 'react-apollo'

import query from './tpopkontrzaehls'

export default graphql(query, {
  options: ({ isTpopkontr, tpopkontr }) => ({
    isTpopkontr,
    tpopkontr,
  }),
  name: 'dataTpopkontrzaehls',
})
