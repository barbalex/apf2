import { gql } from '@apollo/client'

import {
  aeTaxonomies,
  apart,
  beob,
  beobQuelleWerte,
  pop,
  popStatusWerte,
} from '../../../shared/fragments'

export default gql`
  query beobByIdQueryForZuordnung($id: UUID!, $apId: UUID!) {
    beobById(id: $id) {
      ...BeobFields
      aeTaxonomyByArtId {
        ...AeTaxonomiesFields
        apartsByArtId(filter: { apId: { equalTo: $apId } }) {
          nodes {
            ...ApartFields
            apByApId {
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
        }
      }
      aeTaxonomyByArtIdOriginal {
        id
        taxid
        artname
      }
      beobQuelleWerteByQuelleId {
        ...BeobQuelleWerteFields
      }
    }
  }
  ${aeTaxonomies}
  ${apart}
  ${beob}
  ${beobQuelleWerte}
  ${pop}
  ${popStatusWerte}
`
