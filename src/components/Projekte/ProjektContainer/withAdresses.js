// @flow
import { graphql } from 'react-apollo'

import query from './adresses.graphql'

export default graphql(query, {
  options: ({ isWerteListen, isAdresse }) => ({
    isWerteListen,
    isAdresse,
  }),
  name: 'dataAdresses',
})
