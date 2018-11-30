import gql from 'graphql-tag'

export default gql`
  query BeobAssignLinesQuery(
    $projId: UUID!
    $beobZugeordnetAssignPolylinesIsActiveInMap: Boolean!
    $apId: UUID
    $isAp: Boolean!
  ) {
    beobAssignLines: projektById(id: $projId)
      @include(if: $beobZugeordnetAssignPolylinesIsActiveInMap) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) @include(if: $isAp) {
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
                      popId
                      nr
                      flurname
                      x
                      y
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
