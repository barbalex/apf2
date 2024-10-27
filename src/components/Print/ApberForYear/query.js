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
} from '../../shared/fragments.js'

export const query = gql`
  query projektByIdForApberForYear(
    $projektId: UUID!
    $jahr: Int!
    $apberuebersichtId: UUID!
  ) {
    apberuebersichtById(id: $apberuebersichtId) {
      id
      jahr
      bemerkungen
    }
    allAps: allApHistories(
      filter: {
        bearbeitung: { in: [1, 2, 3] }
        projId: { equalTo: $projektId }
        year: { equalTo: $jahr }
      }
    ) {
      nodes {
        id
        bearbeitung
        aeTaxonomyByArtId {
          ...AeTaxonomiesFields
        }
        popsByApId: popHistoriesByApIdAndYear(
          filter: { bekanntSeit: { lessThanOrEqualTo: $jahr } }
        ) {
          nodes {
            id
            tpopsByPopId: tpopHistoriesByYearAndPopId(
              filter: {
                apberRelevant: { equalTo: true }
                bekanntSeit: { lessThanOrEqualTo: $jahr }
              }
            ) {
              nodes {
                id
                apberRelevant
                tpopmassnsByTpopId(filter: { jahr: { equalTo: $jahr } }) {
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
        zielsByApId: zielsByApIdAndJahr(filter: { jahr: { equalTo: $jahr } }) {
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
        apbersByApId: apbersByApIdAndJahr(
          filter: { jahr: { equalTo: $jahr } }
        ) {
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
