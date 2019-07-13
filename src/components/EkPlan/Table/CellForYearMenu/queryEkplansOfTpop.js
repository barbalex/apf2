import gql from 'graphql-tag'

export default gql`
  query EkplansOfTpopQuery($tpopId: UUID!, $jahr: Int) {
    allEkplans(
      filter: { tpopId: { equalTo: $tpopId }, jahr: { equalTo: $jahr } }
    ) {
      nodes {
        id
        typ
      }
    }
  }
`
