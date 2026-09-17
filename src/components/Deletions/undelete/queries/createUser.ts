import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { user } from '../../../shared/fragments.ts'

export default dynamicGql`
  mutation createUserForUndelete(
    $id: UUID
    $name: String
    $email: String
    $role: String
    $pass: String
  ) {
    createUser(
      input: {
        user: { id: $id, name: $name, email: $email, role: $role, pass: $pass }
      }
    ) {
      user {
        ...UserFields
      }
    }
  }
  ${user}
`
