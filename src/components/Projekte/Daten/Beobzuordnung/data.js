import gql from 'graphql-tag'

import {
  aeEigenschaften,
  apart,
  beob,
  pop,
  beobQuelleWerte,
} from '../../../shared/fragments'

export default gql`
  query beobByIdQuery($id: UUID!, $apId: UUID!) {
    beobById(id: $id) {
      ...BeobFields
      aeEigenschaftenByArtId {
        ...AeEigenschaftenFields
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
        }
      }
      aeEigenschaftenByArtIdOriginal {
        id
        taxid
        artname
      }
      beobQuelleWerteByQuelleId {
        ...BeobQuelleWerteFields
      }
    }
  }
  ${aeEigenschaften}
  ${apart}
  ${beob}
  ${pop}
  ${beobQuelleWerte}
`
