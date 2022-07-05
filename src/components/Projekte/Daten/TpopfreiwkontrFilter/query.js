import { gql } from '@apollo/client'

import {
  aeTaxonomies,
  adresse,
  ekzaehleinheit,
  pop,
  tpop,
  tpopfreiwkontr,
  tpopkontrzaehl,
  tpopkontrzaehlEinheitWerte,
} from '../../../shared/fragments'

export default gql`
  query tpopkontrByIdQueryForEkfFilter($id: UUID!) {
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
            aeTaxonomyByArtId {
              ...AeTaxonomiesFields
            }
            ekzaehleinheitsByApId {
              nodes {
                ...EkzaehleinheitFields
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
  ${aeTaxonomies}
  ${adresse}
  ${ekzaehleinheit}
  ${pop}
  ${tpop}
  ${tpopfreiwkontr}
  ${tpopkontrzaehl}
  ${tpopkontrzaehlEinheitWerte}
`
