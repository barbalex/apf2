import gql from 'graphql-tag'

import {
  aeTaxonomies,
  beob,
  beobQuelleWerte,
  popStatusWerte,
} from '../../../../shared/fragments'

export default gql`
  mutation updateBeobNichtBeurteiltForKarte($id: UUID!, $tpopId: UUID) {
    updateBeobById(
      input: { id: $id, beobPatch: { id: $id, tpopId: $tpopId } }
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
                    popStatusWerteByStatus {
                      ...PopStatusWerteFields
                    }
                    popByPopId {
                      id
                      nr
                    }
                  }
                }
              }
            }
          }
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
  ${popStatusWerte}
`
