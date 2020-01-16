import gql from 'graphql-tag'

import {
  aeTaxonomies,
  beob,
  beobQuelleWerte,
  pop,
  popStatusWerte,
} from '../../../shared/fragments'

export default gql`
  mutation updateBeobForBeobzuordnung(
    $id: UUID!
    $idField: String
    $datum: Date
    $autor: String
    $geomPoint: GeoJSON
    $data: JSON
    $artId: UUID
    $artIdOriginal: UUID
    $infofloraInformiertDatum: Date
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
          geomPoint: $geomPoint
          data: $data
          artId: $artId
          artIdOriginal: $artIdOriginal
          infofloraInformiertDatum: $infofloraInformiertDatum
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
        aeTaxonomyByArtId {
          ...AeTaxonomiesFields
          apByArtId {
            id
            popsByApId {
              nodes {
                id
                tpopsByPopId {
                  nodes {
                    id
                    nr
                    lv95X
                    lv95Y
                    popStatusWerteByStatus {
                      ...PopStatusWerteFields
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
        aeTaxonomyByArtIdOriginal {
          id
          artname
        }
        beobQuelleWerteByQuelleId {
          ...BeobQuelleWerteFields
        }
      }
    }
  }
  ${aeTaxonomies}
  ${beob}
  ${beobQuelleWerte}
  ${pop}
  ${popStatusWerte}
`
