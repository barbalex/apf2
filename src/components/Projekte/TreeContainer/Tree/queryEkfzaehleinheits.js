import gql from 'graphql-tag'

export default gql`
  query EkfzaehleinheitsQuery($ap: [UUID!], $isAp: Boolean!) {
    allEkfzaehleinheits(filter: { apId: { in: $ap } }) @include(if: $isAp) {
      nodes {
        id
        apId
        zaehleinheitId
        bemerkungen
        tpopkontrzaehlEinheitWerteByZaehleinheitId {
          id
          text
        }
      }
    }
  }
`
