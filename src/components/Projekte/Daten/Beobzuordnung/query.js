import gql from 'graphql-tag'

import {
  aeEigenschaften,
  apart,
  beob,
  beobQuelleWerte,
  pop,
  popStatusWerte,
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
  ${beobQuelleWerte}
  ${pop}
  ${popStatusWerte}
`
