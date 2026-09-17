import { gql as dynamicGql } from '../../../../apolloGql.ts'

import {
  aeTaxonomies,
  beob,
  pop,
  popStatusWerte,
} from '../../../shared/fragments.ts'

export const query = dynamicGql`
  query beobByIdQueryForZuordnung($id: UUID!, $apId: UUID!) {
    apById(id: $apId) {
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
    beobById(id: $id) {
      ...BeobFields
      aeTaxonomyByArtId {
        ...AeTaxonomiesFields
      }
      aeTaxonomyByArtIdOriginal {
        id
        taxid
        artname
      }
    }
  }
  ${aeTaxonomies}
  ${beob}
  ${pop}
  ${popStatusWerte}
`
