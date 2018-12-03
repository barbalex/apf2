import gql from 'graphql-tag'

export default gql`
  mutation updateErfkrit(
    $id: UUID!
    $apId: UUID
    $erfolg: Int
    $kriterien: String
    $changedBy: String
  ) {
    updateErfkritById(
      input: {
        id: $id
        erfkritPatch: {
          id: $id
          apId: $apId
          erfolg: $erfolg
          kriterien: $kriterien
          changedBy: $changedBy
        }
      }
    ) {
      erfkrit {
        id
        apId
        erfolg
        kriterien
        changedBy
      }
    }
  }
`
