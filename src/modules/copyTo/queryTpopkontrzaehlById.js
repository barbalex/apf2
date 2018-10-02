import gql from 'graphql-tag'

export default gql`
  query Query($id: UUID!) {
    tpopkontrzaehlById(id: $id) {
      id
      tpopkontrId
      anzahl
      einheit
      methode
    }
  }
`
