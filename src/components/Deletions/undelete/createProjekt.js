import gql from 'graphql-tag'

export default gql`
  mutation createProjekt($id: UUID, $name: String) {
    createProjekt(input: { projekt: { id: $id, name: $name } }) {
      projekt {
        id
        name
      }
    }
  }
`
