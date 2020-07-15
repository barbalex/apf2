import { gql } from '@apollo/client'

export default gql`
  query popVonApOhneStatusQuery {
    allPops(filter: { vPopVonapohnestatusesByIdExist: true }) {
      nodes {
        id
        vPopVonapohnestatusesById {
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
    }
  }
`
