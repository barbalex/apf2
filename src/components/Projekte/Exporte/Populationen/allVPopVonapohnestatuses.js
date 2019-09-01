import gql from 'graphql-tag'

export default gql`
  query viewPopVonapohnestatuses {
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
