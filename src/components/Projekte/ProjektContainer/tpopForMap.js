import gql from 'graphql-tag'

export default gql`
  query TpopForMapQuery(
    $apId: UUID!
    $projId: UUID!
    $apIsActiveInMap: Boolean!
  ) {
    # this one is used to refetch data when new tpop was localized
    # so that the new marker appears on map
    tpopForMap: projektById(id: $projId) @include(if: $apIsActiveInMap) {
      id
      apsByProjId(filter: { id: { equalTo: $apId } }) {
        nodes {
          id
          popsByApId {
            nodes {
              id
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
              ) {
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
