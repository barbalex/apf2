import { gql as dynamicGql } from '../../../../../apolloGql.ts'

import {
  aeTaxonomies,
  beob,
  popStatusWerte,
} from '../../../../shared/fragments.ts'

export const updateBeobById = dynamicGql`
  mutation updateBeobForKarteBeobNichtBeurteilt($id: UUID!, $tpopId: UUID) {
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
