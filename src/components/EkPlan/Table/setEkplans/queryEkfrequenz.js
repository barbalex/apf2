import gql from 'graphql-tag'

export default gql`
  query EkfrequenzQuery($code: String!) {
    allEkfrequenzs(filter: { code: { equalTo: $code } }) {
      nodes {
        id
        kontrolljahre
      }
    }
  }
`
