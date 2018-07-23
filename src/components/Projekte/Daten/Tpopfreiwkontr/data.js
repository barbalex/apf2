// @flow
import { graphql } from 'react-apollo'

import dataGql from './data.graphql'

export default graphql(dataGql, {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
})
