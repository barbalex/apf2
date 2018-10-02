import gql from 'graphql-tag'

export default gql`
  mutation createTpopkontrzaehl(
    $id: UUID
    $anzahl: Int
    $einheit: Int
    $methode: Int
    $tpopkontrId: UUID
  ) {
    createTpopkontrzaehl(
      input: {
        tpopkontrzaehl: {
          id: $id
          tpopkontrId: $tpopkontrId
          anzahl: $anzahl
          einheit: $einheit
          methode: $methode
        }
      }
    ) {
      tpopkontrzaehl {
        id
        tpopkontrId
        anzahl
        einheit
        methode
      }
    }
  }
`
