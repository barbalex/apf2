// @flow
import { graphql } from 'react-apollo'

import query from './allTpopkontrzaehlEinheitWertes.graphql'

export default graphql(query, {
  name: 'dataAllTpopkontrzaehlEinheitWertes',
})
