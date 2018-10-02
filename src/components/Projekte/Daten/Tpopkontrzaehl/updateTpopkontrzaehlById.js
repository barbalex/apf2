import gql from 'graphql-tag'

export default gql`
  mutation updateAnzahl(
    $id: UUID!
    $anzahl: Int
    $einheit: Int
    $methode: Int
  ) {
    updateTpopkontrzaehlById(
      input: {
        id: $id
        tpopkontrzaehlPatch: {
          id: $id
          anzahl: $anzahl
          einheit: $einheit
          methode: $methode
        }
      }
    ) {
      tpopkontrzaehl {
        id
        anzahl
        einheit
        methode
      }
    }
  }
`
