import { gql } from '@apollo/client'

export default gql`
  query EkfrequenzQuery($id: UUID!) {
    allEkfrequenzs(filter: { id: { equalTo: $id }, ektyp: { isNull: false } }) {
      nodes {
        id
        kontrolljahre
        ektyp
      }
    }
  }
`
