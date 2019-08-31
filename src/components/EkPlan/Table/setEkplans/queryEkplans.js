import gql from 'graphql-tag'

export default gql`
  query EkplansQuery($jahr: Int) {
    allEkplans(filter: { jahr: { greaterThanOrEqualTo: $jahr } }) {
      nodes {
        id
      }
    }
  }
`
