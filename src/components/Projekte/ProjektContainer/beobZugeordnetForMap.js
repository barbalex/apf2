import gql from 'graphql-tag'

export default gql`
  query BeobZugeordnetForMapMarkersQuery(
    $projId: UUID!
    $apId: UUID
    $beobZugeordnetIsActiveInMap: Boolean!
  ) {
    beobZugeordnetForMap: projektById(id: $projId)
      @include(if: $beobZugeordnetIsActiveInMap) {
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
                    tpopId: { isNull: false }
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
                    tpopByTpopId {
                      id
                      nr
                      flurname
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
