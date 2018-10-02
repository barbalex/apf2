import gql from 'graphql-tag'

export default gql`
  query AllApErfkritWertesQuery {
    allApErfkritWertes {
      nodes {
        id
        code
        text
        sort
      }
    }
  }
`
