import gql from 'graphql-tag'

export default gql`query adrQuery {
  allAdresses {
    nodes {
      id
      name
    }
  }
}`
