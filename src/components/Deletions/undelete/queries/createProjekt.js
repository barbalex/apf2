import { gql } from '@apollo/client'

export default gql`
  mutation createProjektForUndelete($id: UUID, $name: String) {
    createProjekt(input: { projekt: { id: $id, name: $name } }) {
      projekt {
        id
        name
      }
    }
  }
`
