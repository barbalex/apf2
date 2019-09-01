import gql from 'graphql-tag'

export default gql`
  query zielTypWertesQueryForZiel {
    allZielTypWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
`
