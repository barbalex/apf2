import { gql } from '@apollo/client'

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
