// @flow
import { graphql } from 'react-apollo'

import query from './allApErfkritWertes'

export default graphql(query, {
  name: 'dataAllApErfkritWertes',
})
