import gql from 'graphql-tag'

export default gql`
  query ErfkritListsQuery {
    allApErfkritWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
`
