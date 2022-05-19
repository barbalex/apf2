import { gql } from '@apollo/client'

export default gql`
  query otherZaehlOfEkQuery($tpopkontrId: UUID!, $id: UUID!) {
    allTpopkontrzaehls(
      filter: {
        tpopkontrId: { equalTo: $tpopkontrId }
        id: { notEqualTo: $id } 
      }
    ) {
      nodes {
        id
        einheit
      }
    }
  }
`
