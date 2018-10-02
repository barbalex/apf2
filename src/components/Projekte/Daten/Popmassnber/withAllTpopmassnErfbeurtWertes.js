// @flow
import { graphql } from 'react-apollo'

import query from './allTpopmassnErfbeurtWertes'

export default graphql(query, {
  name: 'dataAllTpopmassnErfbeurtWertes',
})
