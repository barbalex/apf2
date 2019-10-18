import gql from 'graphql-tag'

import {
  aeTaxonomies,
  pop,
  popStatusWerte,
  tpop,
} from '../../../../shared/fragments'

export default gql`
  query TpopForMapQuery(
    $apId: UUID!
    $projId: UUID!
    $isActiveInMap: Boolean!
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
          aeTaxonomyByArtId {
            ...AeTaxonomiesFields
          }
          popsByApId(filter: $popFilter) {
            nodes {
              ...PopFields
              tpopsByPopId(filter: $tpopFilter) {
                nodes {
                  ...TpopFields
                  popStatusWerteByStatus {
                    ...PopStatusWerteFields
                  }
                  popByPopId {
                    ...PopFields
                    apByApId {
                      id
                      aeTaxonomyByArtId {
                        ...AeTaxonomiesFields
                      }
                    }
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
          aeTaxonomyByArtId {
            ...AeTaxonomiesFields
          }
          popsByApId(filter: $popFilter) {
            nodes {
              ...PopFields
              popStatusWerteByStatus {
                ...PopStatusWerteFields
              }
              tpopsByPopId(filter: $tpopFilter) {
                nodes {
                  ...TpopFields
                  popByPopId {
                    ...PopFields
                    apByApId {
                      id
                      aeTaxonomyByArtId {
                        ...AeTaxonomiesFields
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
  }
  ${aeTaxonomies}
  ${pop}
  ${popStatusWerte}
  ${tpop}
`
