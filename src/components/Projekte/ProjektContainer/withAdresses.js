// @flow
import { graphql } from 'react-apollo'

import query from './adresses'

export default graphql(query, {
  options: ({ isWerteListen, isAdresse }) => ({
    isWerteListen,
    isAdresse,
  }),
  name: 'dataAdresses',
})
