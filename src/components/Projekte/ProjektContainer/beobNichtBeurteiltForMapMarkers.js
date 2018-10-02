import gql from 'graphql-tag'

export default gql`
  query BeobNichtBeurteiltForMapMarkersQuery(
    $projId: UUID!
    $apId: UUID
    $apIsActiveInMap: Boolean!
  ) {
    beobNichtBeurteiltForMapMarkers: projektById(id: $projId)
      @include(if: $apIsActiveInMap) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          apartsByApId {
            nodes {
              id
              artId
              aeEigenschaftenByArtId {
                id
                beobsByArtId(
                  filter: {
                    tpopId: { isNull: true }
                    nichtZuordnen: { equalTo: false }
                    x: { isNull: false }
                    y: { isNull: false }
                  }
                ) {
                  nodes {
                    id
                    autor
                    datum
                    beobQuelleWerteByQuelleId {
                      id
                      name
                    }
                    x
                    y
                    aeEigenschaftenByArtId {
                      id
                      artname
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
