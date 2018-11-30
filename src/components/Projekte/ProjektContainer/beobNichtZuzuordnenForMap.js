import gql from 'graphql-tag'

export default gql`
  query BeobNichtZuzuordnenForMapQuery(
    $ap: [UUID!]
    $beobNichtZuzuordnenIsActiveInMap: Boolean!
  ) {
    beobNichtZuzuordnenForMap: allVApbeobs(
      filter: { apId: { in: $ap }, nichtZuordnen: { equalTo: true } }
    ) @include(if: $beobNichtZuzuordnenIsActiveInMap) {
      nodes {
        id
        x
        y
      }
    }
  }
`
