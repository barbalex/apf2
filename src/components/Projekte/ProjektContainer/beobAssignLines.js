import gql from 'graphql-tag'

export default gql`
  query BeobAssignLinesQuery(
    $projId: UUID!
    $isProjekt: Boolean!
    $apId: UUID
    $isAp: Boolean!
  ) {
    beobAssignLines: projektById(id: $projId) @include(if: $isProjekt) {
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
