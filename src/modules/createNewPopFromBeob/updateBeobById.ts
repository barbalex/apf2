import { gql } from '@apollo/client'

import {
  aeTaxonomies,
  beob,
  popStatusWerte,
  tpop,
} from '../../components/shared/fragments.ts'

export const updateBeobById = gql`
  mutation updateBeobForCreateNewPopFromBeob($id: UUID!, $tpopId: UUID) {
    updateBeobById(
      input: {
        id: $id
        beobPatch: { id: $id, tpopId: $tpopId, nichtZuordnen: false }
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
                    ...TpopFields
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
  ${tpop}
`
