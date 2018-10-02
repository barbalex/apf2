import gql from 'graphql-tag'

export default gql`
  mutation updatePopById($id: UUID!, $apId: UUID) {
    updatePopById(input: { id: $id, popPatch: { apId: $apId } }) {
      pop {
        id
        apId
      }
    }
  }
`
