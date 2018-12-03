import gql from 'graphql-tag'

export default gql`
  mutation updateEkfzaehleinheit(
    $id: UUID!
    $bemerkungen: String
    $apId: UUID
    $zaehleinheitId: UUID
    $changedBy: String
  ) {
    updateEkfzaehleinheitById(
      input: {
        id: $id
        ekfzaehleinheitPatch: {
          id: $id
          bemerkungen: $bemerkungen
          apId: $apId
          zaehleinheitId: $zaehleinheitId
          changedBy: $changedBy
        }
      }
    ) {
      ekfzaehleinheit {
        id
        bemerkungen
        apId
        zaehleinheitId
        changedBy
        tpopkontrzaehlEinheitWerteByZaehleinheitId {
          id
          text
        }
      }
    }
  }
`
