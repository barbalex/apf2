import gql from 'graphql-tag'

export default gql`
  mutation createTpopkontrzaehl($tpopkontrId: UUID, $einheit: Int) {
    createTpopkontrzaehl(
      input: {
        tpopkontrzaehl: { tpopkontrId: $tpopkontrId, einheit: $einheit }
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
