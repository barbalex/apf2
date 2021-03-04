import { gql } from '@apollo/client'

import {
  aeTaxonomies,
  beob,
  pop,
  popStatusWerte,
} from '../../../shared/fragments'

export default gql`
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
