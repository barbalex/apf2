import gql from 'graphql-tag'

export default gql`
  query AllApErfkritWertesQuery {
    allApErfkritWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
`
