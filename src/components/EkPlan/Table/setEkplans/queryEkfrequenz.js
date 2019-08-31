import gql from 'graphql-tag'

export default gql`
  query EkfrequenzQuery($code: Int!) {
    allEkplans(
      filter: {
        jahr: { greaterThanOrEqualTo: $jahr }
        tpopId: { equalTo: $tpopId }
      }
    ) {
      nodes {
        id
      }
    }
  }
`
