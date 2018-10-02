import gql from 'graphql-tag'

export default gql`
  mutation updatePop(
    $id: UUID!
    $apId: UUID
    $nr: Int
    $name: String
    $status: Int
    $statusUnklar: Boolean
    $statusUnklarBegruendung: String
    $bekanntSeit: Int
    $x: Int
    $y: Int
  ) {
    updatePopById(
      input: {
        id: $id
        popPatch: {
          id: $id
          apId: $apId
          nr: $nr
          name: $name
          status: $status
          statusUnklar: $statusUnklar
          statusUnklarBegruendung: $statusUnklarBegruendung
          bekanntSeit: $bekanntSeit
          x: $x
          y: $y
        }
      }
    ) {
      pop {
        id
        apId
        nr
        name
        status
        statusUnklar
        statusUnklarBegruendung
        bekanntSeit
        x
        y
      }
    }
  }
`
