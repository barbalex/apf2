import gql from 'graphql-tag'

export default gql`
  mutation createApart($id: UUID, $apId: UUID, $artId: UUID) {
    createApart(input: { apart: { id: $id, apId: $apId, artId: $artId } }) {
      apart {
        id
        apId
        artId
      }
    }
  }
`
