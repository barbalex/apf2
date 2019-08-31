import gql from 'graphql-tag'

export default gql`
  query EkplansQuery($jahr: Int!, $tpopId: UUID!) {
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
