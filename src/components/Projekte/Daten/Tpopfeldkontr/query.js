import gql from 'graphql-tag'

import {
  adresse,
  pop,
  tpopEntwicklungWerte,
  tpopfeldkontr,
  tpopkontrIdbiotuebereinstWerte,
} from '../../../shared/fragments'

export default gql`
  query tpopkontrByIdQuery($id: UUID!) {
    tpopkontrById(id: $id) {
      ...TpopfeldkontrFields
      adresseByBearbeiter {
        ...AdresseFields
      }
      tpopByTpopId {
        id
        popByPopId {
          ...PopFields
        }
      }
    }
    allTpopkontrIdbiotuebereinstWertes {
      nodes {
        ...TpopkontrIdbiotuebereinstWerteFields
      }
    }
    allTpopEntwicklungWertes {
      nodes {
        ...TpopEntwicklungWerteFields
      }
    }
    allAeLrdelarzes {
      nodes {
        id
        label
        einheit
        sort
      }
    }
  }
  ${adresse}
  ${pop}
  ${tpopEntwicklungWerte}
  ${tpopfeldkontr}
  ${tpopkontrIdbiotuebereinstWerte}
`
