import gql from 'graphql-tag'

export default gql`
  mutation updateApart(
    $id: UUID!
    $apId: UUID
    $artId: UUID
    $changedBy: String
  ) {
    updateApartById(
      input: {
        id: $id
        apartPatch: {
          id: $id
          apId: $apId
          artId: $artId
          changedBy: $changedBy
        }
      }
    ) {
      apart {
        id
        apId
        artId
        changedBy
        aeEigenschaftenByArtId {
          id
          artname
        }
      }
    }
  }
`
