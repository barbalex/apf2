import gql from 'graphql-tag'

export default gql`
  query PopForMapQuery(
    $projId: UUID!
    $apId: UUID!
    $tpopLayerIsActive: Boolean!
  ) {
    projektById(id: $projId) {
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
              tpopsByPopId(
                filter: { x: { isNull: false }, y: { isNull: false } }
              ) @include(if: $tpopLayerIsActive) {
                nodes {
                  id
                  popId
                  nr
                  gemeinde
                  flurname
                  x
                  y
                  radius
                  hoehe
                  exposition
                  klima
                  neigung
                  beschreibung
                  katasterNr
                  status
                  statusUnklar
                  statusUnklarGrund
                  apberRelevant
                  bekanntSeit
                  eigentuemer
                  kontakt
                  nutzungszone
                  bewirtschafter
                  bewirtschaftung
                  kontrollfrequenz
                  kontrollfrequenzFreiwillige
                  bemerkungen
                  popByPopId {
                    id
                    nr
                    name
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
