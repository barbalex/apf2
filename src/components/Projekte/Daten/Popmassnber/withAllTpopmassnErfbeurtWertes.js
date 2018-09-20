// @flow
import { graphql } from 'react-apollo'

import query from './allTpopmassnErfbeurtWertes.graphql'

export default graphql(query, {
  name: 'dataAllTpopmassnErfbeurtWertes',
})
