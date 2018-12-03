import gql from 'graphql-tag'

export default gql`
  mutation updateAssozart(
    $id: UUID!
    $bemerkungen: String
    $aeId: UUID
    $apId: UUID
    $changedBy: String
  ) {
    updateAssozartById(
      input: {
        id: $id
        assozartPatch: {
          id: $id
          bemerkungen: $bemerkungen
          aeId: $aeId
          apId: $apId
          changedBy: $changedBy
        }
      }
    ) {
      assozart {
        id
        bemerkungen
        aeId
        apId
        changedBy
        aeEigenschaftenByAeId {
          id
          artname
        }
        apByApId {
          artId
          assozartsByApId {
            nodes {
              id
              aeId
            }
          }
        }
      }
    }
  }
`
