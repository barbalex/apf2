import gql from 'graphql-tag'

export default gql`
  query BeobNichtBeurteiltsQuery($ap: [UUID!], $isAp: Boolean!) {
    allVApbeobs(
      filter: {
        nichtZuordnen: { equalTo: false }
        apId: { in: $ap }
        tpopId: { isNull: true }
      }
    ) @include(if: $isAp) {
      nodes {
        id
        label
        apId
      }
    }
  }
`
