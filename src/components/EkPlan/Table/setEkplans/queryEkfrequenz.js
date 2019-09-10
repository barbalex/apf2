import gql from 'graphql-tag'

export default gql`
  query EkfrequenzQuery($code: String!) {
    allEkfrequenzs(
      filter: { code: { equalTo: $code }, ektyp: { isNull: false } }
    ) {
      nodes {
        id
        kontrolljahre
        ektyp
      }
    }
  }
`
