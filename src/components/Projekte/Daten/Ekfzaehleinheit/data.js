import gql from 'graphql-tag'

export default gql`
  query ekfzaehleinheitByIdQuery($id: UUID!) {
    ekfzaehleinheitById(id: $id) {
      id
      apId
      zaehleinheitId
      bemerkungen
      tpopkontrzaehlEinheitWerteByZaehleinheitId {
        id
        text
      }
      apByApId {
        id
        ekfzaehleinheitsByApId {
          nodes {
            id
            zaehleinheitId
          }
        }
      }
    }
  }
`
