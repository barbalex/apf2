import gql from 'graphql-tag'

export default gql`
  query EkfrequenzQueryForSetStartjahr($code: String!) {
    ekfrequenzByCode(code: $code) {
      id
      kontrolljahreAb
    }
  }
`
