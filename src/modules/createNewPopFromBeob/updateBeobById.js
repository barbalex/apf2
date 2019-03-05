import gql from 'graphql-tag'

import { beob } from '../../components/shared/fragments'

export default gql`
  mutation updateBeob($id: UUID!, $tpopId: UUID) {
    updateBeobById(
      input: { id: $id, beobPatch: { id: $id, tpopId: $tpopId } }
    ) {
      beob {
        ...BeobFields
        aeEigenschaftenByArtId {
          id
          artname
          apByArtId {
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
          id
          name
        }
      }
    }
  }
  ${beob}
`
