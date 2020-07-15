import { gql } from '@apollo/client'

import {
  adresse,
  aeTaxonomies,
  apber,
  tpopber,
  ziel,
  apErfkritWerte,
  tpopmassnTypWerte,
  zielber,
  zielTypWerte,
} from '../../shared/fragments'

export default gql`
  query projektById($projektId: UUID!, $jahr: Int!) {
    allAps(
      filter: {
        bearbeitung: { in: [1, 2, 3] }
        projId: { equalTo: $projektId }
      }
    ) {
      nodes {
        id
        startJahr
        bearbeitung
        aeTaxonomyByArtId {
          ...AeTaxonomiesFields
        }
        adresseByBearbeiter {
          ...AdresseFields
        }
        popsByApId {
          nodes {
            id
            tpopsByPopId(condition: { apberRelevant: true }) {
              nodes {
                id
                apberRelevant
                firstTpopmassn: tpopmassnsByTpopId(
                  orderBy: DATUM_ASC
                  first: 1
                ) {
                  nodes {
                    id
                    datum
                  }
                }
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
                firstTpopber: tpopbersByTpopId(orderBy: JAHR_ASC, first: 1) {
                  nodes {
                    ...TpopberFields
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
  ${tpopber}
  ${tpopmassnTypWerte}
  ${ziel}
  ${zielber}
  ${zielTypWerte}
`
