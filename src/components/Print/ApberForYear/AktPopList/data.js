import gql from 'graphql-tag'

export default gql`
  query projektById($projektId: UUID!) {
    projektById(id: $projektId) {
      id
      apsByProjId(filter: { bearbeitung: { in: [1, 2, 3] } }) {
        nodes {
          id
          aeEigenschaftenByArtId {
            id
            artname
          }
          pops100: popsByApId(filter: { status: { equalTo: 100 } }) {
            nodes {
              id
              status
              tpopsByPopId(filter: { apberRelevant: { equalTo: 1 } }) {
                totalCount
              }
            }
          }
          pops200: popsByApId(filter: { status: { equalTo: 200 } }) {
            nodes {
              id
              status
              tpopsByPopId(filter: { apberRelevant: { equalTo: 1 } }) {
                totalCount
              }
            }
          }
        }
      }
    }
  }
`
