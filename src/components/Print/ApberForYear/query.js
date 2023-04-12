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
                tpopmassnsByTpopId: tpopmassnsByTpopIdAndJahr {
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
    jberAbc(jahr: $jahr) {
      nodes {
        artname
        id
        startJahr
        bearbeiter
        bearbeitung
        a3LPop
        a3LTpop
        a4LPop
        a4LTpop
        a5LPop
        a5LTpop
        a7LPop
        a7LTpop
        a8LPop
        a8LTpop
        a9LPop
        a9LTpop
        b1LPop
        b1LTpop
        b1FirstYear
        b1RPop
        b1RTpop
        c1LPop
        c1LTpop
        c1RPop
        c1RTpop
        c1FirstYear
        firstMassn
        c2RPop
        c2RTpop
        c3RPop
        c3RTpop
        c4RPop
        c4RTpop
        c5RPop
        c5RTpop
        c6RPop
        c6RTpop
        c7RPop
        c7RTpop
        erfolg
        erfolgVorjahr
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
