import gql from 'graphql-tag'

export default gql`
  query BeobNichtZuzuordnensQuery($ap: [UUID!], $isAp: Boolean!) {
    beobNichtZuzuordnens: allVApbeobs(
      filter: { nichtZuordnen: { equalTo: true }, apId: { in: $ap } }
      orderBy: DATUM_DESC
    ) @include(if: $isAp) {
      nodes {
        id
        apId
        nichtZuordnen
        artId
        datum
        autor
        quelle
      }
    }
  }
`
