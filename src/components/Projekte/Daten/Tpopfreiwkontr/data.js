// @flow
import { graphql } from 'react-apollo'

import dataGql from './data.graphql'

export default graphql(dataGql, {
  options: ({ id }) => ({
    variables: {
      id: id || '99999999-9999-9999-9999-999999999999',
    },
  }),
})
