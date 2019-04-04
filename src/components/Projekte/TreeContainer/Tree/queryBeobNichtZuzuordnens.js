import gql from 'graphql-tag'

export default gql`
  query BeobNichtZuzuordnensQuery($ap: [UUID!], $isAp: Boolean!) {
    allVApbeobs(
      filter: { nichtZuordnen: { equalTo: true }, apId: { in: $ap } }
    ) @include(if: $isAp) {
      nodes {
        id
        label
        apId
        artId
      }
    }
  }
`
