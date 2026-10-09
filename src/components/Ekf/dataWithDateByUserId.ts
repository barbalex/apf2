import { gql as dynamicGql } from '../../apolloGql.ts'

import { aeTaxonomies, projekt } from '../shared/fragments.ts'

export const dataWithDateByUserId = dynamicGql`
  query ekfDataWithDateByUseridQuery($id: UUID!, $jahr: Int!) {
    userById(id: $id) {
      id
      adresseByAdresseId {
        id
        tpopkontrsByBearbeiter(
          filter: {
            typ: { equalTo: "Freiwilligen-Kontrolle" }
            jahr: { equalTo: $jahr }
          }
        ) {
          nodes {
            id
            datum
            tpopByTpopId {
              id
              nr
              flurname
              gemeinde
              popByPopId {
                id
                nr
                name
                apByApId {
                  id
                  aeTaxonomyByArtId {
                    ...AeTaxonomiesFields
                  }
                  projektByProjId {
                    ...ProjektFields
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
  ${projekt}
`
