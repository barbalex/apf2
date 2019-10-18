import gql from 'graphql-tag'

import { aeTaxonomies, projekt } from '../../shared/fragments'

export default gql`
  query ekfDataWithDateByAdresseIdQuery($id: UUID!, $jahr: Int!) {
    adresseById(id: $id) {
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
  ${aeTaxonomies}
  ${projekt}
`
