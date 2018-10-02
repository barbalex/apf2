import gql from 'graphql-tag'

export default gql`
  query TpopkontrzaehlQuery($id: UUID!) {
    tpopkontrzaehlById(id: $id) {
      id
      anzahl
      einheit
      methode
      tpopkontrzaehlEinheitWerteByEinheit {
        id
        text
      }
    }
  }
`
