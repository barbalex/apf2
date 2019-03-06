import gql from 'graphql-tag'

import {
  adresse,
  pop,
  tpopEntwicklungWerte,
  tpopfeldkontr,
  tpopkontrIdbiotuebereinstWerte,
} from '../../../shared/fragments'

export default gql`
  query tpopkontrByIdQuery($id: UUID!, $showFilter: Boolean!) {
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
    allTpopkontrs(
      filter: {
        or: [
          { typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" } }
          { typ: { isNull: true } }
        ]
      }
    ) @include(if: $showFilter) {
      nodes {
        ...TpopfeldkontrFields
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
