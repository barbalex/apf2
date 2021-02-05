import { gql } from '@apollo/client'

import {
  adresse,
  aeTaxonomies,
  apber,
  ziel,
  apErfkritWerte,
  tpopmassnTypWerte,
  zielber,
  zielTypWerte,
} from '../../shared/fragments'

export default gql`
  query projektByIdForApberForYear($projektId: UUID!, $jahr: Int!) {
    allAps(
      filter: {
        bearbeitung: { in: [1, 2, 3] }
        projId: { equalTo: $projektId }
      }
    ) {
      nodes {
        id
        bearbeitung
        aeTaxonomyByArtId {
          ...AeTaxonomiesFields
        }
        adresseByBearbeiter {
          ...AdresseFields
        }
        popsByApId(filter: { bekanntSeit: { lessThanOrEqualTo: $jahr } }) {
          nodes {
            id
            tpopsByPopId(
              filter: {
                apberRelevant: { equalTo: true }
                bekanntSeit: { lessThanOrEqualTo: $jahr }
              }
            ) {
              nodes {
                id
                apberRelevant
                tpopmassnsByTpopId(condition: { jahr: $jahr }) {
                  nodes {
                    id
                    datum
                    tpopmassnTypWerteByTyp {
                      ...TpopmassnTypWerteFields
                    }
                    beschreibung
                    tpopByTpopId {
                      id
                      nr
                      flurname
                      popByPopId {
                        id
                        nr
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
        erfkritsByApId {
          nodes {
            id
            kriterien
            apErfkritWerteByErfolg {
              ...ApErfkritWerteFields
            }
          }
        }
        zielsByApId(filter: { jahr: { equalTo: $jahr } }) {
          nodes {
            ...ZielFields
            zielTypWerteByTyp {
              ...ZielTypWerteFields
            }
            zielbersByZielId {
              nodes {
                ...ZielberFields
              }
            }
          }
        }
        apbersByApId(filter: { jahr: { equalTo: $jahr } }) {
          totalCount
          nodes {
            ...ApberFields
            apErfkritWerteByBeurteilung {
              ...ApErfkritWerteFields
            }
            adresseByBearbeiter {
              ...AdresseFields
            }
          }
        }
      }
    }
  }
  ${adresse}
  ${aeTaxonomies}
  ${apber}
  ${apErfkritWerte}
  ${tpopmassnTypWerte}
  ${ziel}
  ${zielber}
  ${zielTypWerte}
`
