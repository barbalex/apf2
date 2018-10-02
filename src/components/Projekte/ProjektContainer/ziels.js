import gql from 'graphql-tag'

export default gql`
  query ZielsQuery($ap: [UUID!], $isAp: Boolean!) {
    ziels: allZiels(filter: { apId: { in: $ap } }) @include(if: $isAp) {
      nodes {
        id
        apId
        jahr
        bezeichnung
        typ
        zielTypWerteByTyp {
          id
          text
        }
      }
    }
  }
`
