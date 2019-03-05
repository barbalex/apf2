import gql from 'graphql-tag'

import { aeEigenschaften } from '../../shared/fragments'

export default gql`
  query ekfDataWithDateByUsernameQuery($userName: String!, $jahr: Int!) {
    userByName(name: $userName) {
      id
      adresseByAdresseId {
        id
        tpopkontrsByBearbeiter(
          filter: {
            typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
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
                  aeEigenschaftenByArtId {
                    ...AeEigenschaftenFields
                  }
                  projektByProjId {
                    id
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
`
