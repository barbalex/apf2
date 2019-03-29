import gql from 'graphql-tag'

import {
  aeEigenschaften,
  pop,
  popStatusWerte,
  tpop,
} from '../../../../shared/fragments'

export default gql`
  query PopForMapQuery(
    $projId: UUID!
    $apId: UUID!
    $isActiveInMap: Boolean!
    $tpopLayerIsActive: Boolean!
    $perProj: Boolean!
    $perAp: Boolean!
    $popFilter: PopFilter!
    $tpopFilter: TpopFilter!
  ) {
    projektById(id: $projId) @include(if: $isActiveInMap) {
      id
      perAp: apsByProjId(filter: { id: { equalTo: $apId } })
        @include(if: $perAp) {
        nodes {
          id
          popsByApId(filter: $popFilter) {
            nodes {
              ...PopFields
              popStatusWerteByStatus {
                ...PopStatusWerteFields
              }
              apByApId {
                id
                aeEigenschaftenByArtId {
                  ...AeEigenschaftenFields
                }
              }
              tpopsByPopId(filter: $tpopFilter)
                @include(if: $tpopLayerIsActive) {
                nodes {
                  ...TpopFields
                  popByPopId {
                    id
                    nr
                    name
                  }
                }
              }
            }
          }
        }
      }
      perProj: apsByProjId @include(if: $perProj) {
        nodes {
          id
          popsByApId(filter: $popFilter) {
            nodes {
              ...PopFields
              popStatusWerteByStatus {
                ...PopStatusWerteFields
              }
              apByApId {
                id
                aeEigenschaftenByArtId {
                  ...AeEigenschaftenFields
                }
              }
              tpopsByPopId(filter: $tpopFilter)
                @include(if: $tpopLayerIsActive) {
                nodes {
                  ...TpopFields
                  popByPopId {
                    id
                    nr
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${aeEigenschaften}
  ${pop}
  ${popStatusWerte}
  ${tpop}
`
