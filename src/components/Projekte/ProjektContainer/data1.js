// @flow
import { graphql } from 'react-apollo'

import data1Gql from './data1.graphql'

export default graphql(data1Gql, {
  name: 'data1',
})
