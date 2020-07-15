import { gql } from '@apollo/client'

import { aeTaxonomies, projekt } from '../../shared/fragments'

export default gql`
  query ekfDataByUserQuery($userName: String!, $jahr: Int!) {
    userByName(name: $userName) {
      id
      adresseByAdresseId {
        id
        tpopkontrsByBearbeiter(
          filter: {
            typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
            or: [{ jahr: { equalTo: $jahr } }, { jahr: { isNull: true } }]
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
