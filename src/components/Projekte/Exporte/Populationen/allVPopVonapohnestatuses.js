import gql from 'graphql-tag'

export default gql`
  query view {
    allVPopVonapohnestatuses {
      nodes {
        apId
        artname
        apBearbeitung
        id
        nr
        name
        status
        x
        y
      }
    }
  }
`
