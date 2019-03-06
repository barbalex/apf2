import gql from 'graphql-tag'

import { aeEigenschaften, beob, pop } from '../../../shared/fragments'

export default gql`
  mutation updateBeob(
    $id: UUID!
    $idField: String
    $datum: Date
    $autor: String
    $x: Int
    $y: Int
    $data: JSON
    $artId: UUID
    $artIdOriginal: UUID
    $tpopId: UUID
    $nichtZuordnen: Boolean
    $bemerkungen: String
    $quelleId: UUID
    $changedBy: String
  ) {
    updateBeobById(
      input: {
        id: $id
        beobPatch: {
          id: $id
          idField: $idField
          datum: $datum
          autor: $autor
          x: $x
          y: $y
          data: $data
          artId: $artId
          artIdOriginal: $artIdOriginal
          tpopId: $tpopId
          nichtZuordnen: $nichtZuordnen
          bemerkungen: $bemerkungen
          quelleId: $quelleId
          changedBy: $changedBy
        }
      }
    ) {
      beob {
        ...BeobFields
        aeEigenschaftenByArtId {
          ...AeEigenschaftenFields
          apByArtId {
            id
            popsByApId {
              nodes {
                id
                tpopsByPopId {
                  nodes {
                    id
                    nr
                    x
                    y
                    popStatusWerteByStatus {
                      id
                      text
                    }
                    popByPopId {
                      ...PopFields
                    }
                  }
                }
              }
            }
          }
        }
        aeEigenschaftenByArtIdOriginal {
          id
          artname
        }
        beobQuelleWerteByQuelleId {
          id
          name
        }
      }
    }
  }
  ${aeEigenschaften}
  ${beob}
  ${pop}
`
