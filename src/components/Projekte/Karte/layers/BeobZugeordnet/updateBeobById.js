import { gql } from '@apollo/client'

import {
  aeTaxonomies,
  beob,
  popStatusWerte,
} from '../../../../shared/fragments'

export default gql`
  mutation updateBeobForKarteBeobZugeordnet($id: UUID!, $tpopId: UUID) {
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
      }
    }
  }
  ${aeTaxonomies}
  ${beob}
  ${popStatusWerte}
`
