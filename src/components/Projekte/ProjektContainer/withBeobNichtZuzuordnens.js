// @flow
import { graphql } from 'react-apollo'

import query from './beobNichtZuzuordnens'

export default graphql(query, {
  options: ({ isAp, ap }) => ({
    variables: {
      isAp,
      ap,
    },
  }),
  name: 'dataBeobNichtZuzuordnens',
})
