import gql from 'graphql-tag'

export default gql`
  query PopForMapQuery($projId: UUID!, $apId: UUID!) {
    popForMap: projektById(id: $projId) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId(filter: { x: { isNull: false }, y: { isNull: false } }) {
            nodes {
              id
              apId
              nr
              name
              status
              statusUnklar
              statusUnklarBegruendung
              bekanntSeit
              x
              y
            }
          }
        }
      }
    }
  }
`
