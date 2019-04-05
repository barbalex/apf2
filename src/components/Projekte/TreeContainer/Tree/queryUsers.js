import gql from 'graphql-tag'

import { user } from '../../../shared/fragments'

export default gql`
  query UsersQuery($filter: UserFilter!) {
    allUsers(filter: $filter, orderBy: LABEL_ASC) {
      nodes {
        ...UserFields
      }
    }
  }
  ${user}
`
