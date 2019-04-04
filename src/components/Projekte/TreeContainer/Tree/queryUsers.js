import gql from 'graphql-tag'

import { user } from '../../../shared/fragments'

export default gql`
  query UsersQuery {
    allUsers(orderBy: LABEL_ASC) {
      nodes {
        ...UserFields
      }
    }
  }
  ${user}
`
