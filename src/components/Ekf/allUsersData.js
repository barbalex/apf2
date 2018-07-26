// @flow
import { graphql } from 'react-apollo'

import allUsers from './allUsers.graphql'

export default graphql(allUsers, {
  name: 'allUsersData',
})
