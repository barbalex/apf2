// @flow
import { graphql } from 'react-apollo'

import query from './allTpopkontrzaehlEinheitWertes'

export default graphql(query, {
  name: 'dataAllTpopkontrzaehlEinheitWertes',
})
