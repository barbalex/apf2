import gql from 'graphql-tag'

export default gql`
  query BeobNichtZuzuordnenForMapQuery(
    $ap: [UUID!]
    $apIsActiveInMap: Boolean!
  ) {
    beobNichtZuzuordnenForMap: allVApbeobs(
      filter: { apId: { in: $ap }, nichtZuordnen: { equalTo: true } }
    ) @include(if: $apIsActiveInMap) {
      nodes {
        id
        x
        y
      }
    }
  }
`
