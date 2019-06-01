import gql from 'graphql-tag'

import {
  aeEigenschaften,
  beob,
  beobQuelleWerte,
  popStatusWerte,
  tpop,
} from '../../components/shared/fragments'

export default gql`
  mutation updateBeob($id: UUID!, $tpopId: UUID) {
    updateBeobById(
      input: { id: $id, beobPatch: { id: $id, tpopId: $tpopId } }
    ) {
      beob {
        ...BeobFields
        aeEigenschaftenByArtId {
          ...AeEigenschaftenFields
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
        beobQuelleWerteByQuelleId {
          ...BeobQuelleWerteFields
        }
      }
    }
  }
  ${aeEigenschaften}
  ${beob}
  ${beobQuelleWerte}
  ${popStatusWerte}
  ${tpop}
`
