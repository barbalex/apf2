import gql from 'graphql-tag'

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
