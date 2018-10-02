import gql from 'graphql-tag'

export default gql`
  mutation createAssozart(
    $id: UUID
    $bemerkungen: String
    $aeId: UUID
    $apId: UUID
  ) {
    createAssozart(
      input: {
        assozart: {
          id: $id
          bemerkungen: $bemerkungen
          aeId: $aeId
          apId: $apId
        }
      }
    ) {
      assozart {
        id
        bemerkungen
        aeId
        apId
      }
    }
  }
`
