// @flow
import { graphql } from 'react-apollo'

import query from './allApErfkritWertes.graphql'

export default graphql(query, {
  name: 'dataAllApErfkritWertes',
})
