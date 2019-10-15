import gql from 'graphql-tag'

import { aeEigenschaften, projekt } from '../shared/fragments'

export default gql`
  query dataByAdresseQuery($id: UUID!, $jahr: Int!) {
    adresseById(id: $id) {
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
                aeEigenschaftenByArtId {
                  ...AeEigenschaftenFields
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
  ${aeEigenschaften}
  ${projekt}
`
