// @flow
import gql from 'graphql-tag'

import {
  aeEigenschaften,
  adresse,
  pop,
  tpop,
  tpopfreiwkontr,
} from '../../../shared/fragments'

export default gql`
  query tpopkontrByIdQuery($id: UUID!, $showFilter: Boolean!) {
    tpopkontrById(id: $id) {
      ...TpopfreiwkontrFields
      adresseByBearbeiter {
        ...AdresseFields
        usersByAdresseId {
          totalCount
        }
      }
      tpopByTpopId {
        ...TpopFields
        popByPopId {
          ...PopFields
          apByApId {
            id
            ekfBeobachtungszeitpunkt
            aeEigenschaftenByArtId {
              ...AeEigenschaftenFields
            }
            ekfzaehleinheitsByApId {
              nodes {
                id
                tpopkontrzaehlEinheitWerteByZaehleinheitId {
                  id
                  code
                  text
                  sort
                }
              }
            }
          }
        }
      }
      tpopkontrzaehlsByTpopkontrId {
        nodes {
          id
          anzahl
          einheit
        }
      }
    }
    allTpopkontrs(
      filter: { typ: { equalTo: "Freiwilligen-Erfolgskontrolle" } }
    ) @include(if: $showFilter) {
      nodes {
        ...TpopfreiwkontrFields
      }
    }
  }
  ${aeEigenschaften}
  ${adresse}
  ${pop}
  ${tpop}
  ${tpopfreiwkontr}
`
