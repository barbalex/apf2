import gql from 'graphql-tag'

export default gql`
  mutation createTpopkontrzaehl($tpopkontrId: UUID) {
    createTpopkontrzaehl(
      input: { tpopkontrzaehl: { tpopkontrId: $tpopkontrId } }
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
