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
        lv95X: x
        lv95Y: y
      }
    }
  }
`
