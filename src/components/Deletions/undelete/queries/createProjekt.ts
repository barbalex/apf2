import { graphql } from '../../../../gql/index.ts'

export default graphql(`
  mutation createProjektForUndelete($id: UUID, $name: String) {
    createProjekt(input: { projekt: { id: $id, name: $name } }) {
      projekt {
        id
        name
      }
    }
  }
`)
