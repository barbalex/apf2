import gql from 'graphql-tag'

export default gql`
  query zielByIdQuery {
    allZielTypWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
`
