import gql from 'graphql-tag'

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
