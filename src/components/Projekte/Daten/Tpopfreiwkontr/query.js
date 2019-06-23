// @flow
import gql from 'graphql-tag'

import {
  aeEigenschaften,
  adresse,
  pop,
  tpop,
  tpopfreiwkontr,
  tpopkontrzaehl,
  tpopkontrzaehlEinheitWerte,
} from '../../../shared/fragments'

export default gql`
  query tpopkontrByIdQuery($id: UUID!) {
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
            ekzaehleinheitsByApId {
              nodes {
                id
                tpopkontrzaehlEinheitWerteByZaehleinheitId {
                  ...TpopkontrzaehlEinheitWerteFields
                }
              }
            }
          }
        }
      }
      tpopkontrzaehlsByTpopkontrId(orderBy: EINHEIT_ASC) {
        nodes {
          ...TpopkontrzaehlFields
        }
      }
    }
  }
  ${aeEigenschaften}
  ${adresse}
  ${pop}
  ${tpop}
  ${tpopfreiwkontr}
  ${tpopkontrzaehl}
  ${tpopkontrzaehlEinheitWerte}
`
