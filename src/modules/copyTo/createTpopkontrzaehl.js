import gql from 'graphql-tag'

export default gql`
  mutation createTpopkontrzaehl(
    $anzahl: Int
    $einheit: Int
    $methode: Int
    $tpopkontrId: UUID
  ) {
    createTpopkontrzaehl(
      input: {
        tpopkontrzaehl: {
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
