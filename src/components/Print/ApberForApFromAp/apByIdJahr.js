import { gql } from '@apollo/client'

import {
  adresse,
  aeTaxonomies,
  ap,
  apber,
  tpopber,
  ziel,
  apErfkritWerte,
  tpopmassnTypWerte,
  zielber,
  zielTypWerte,
} from '../../shared/fragments'

export default gql`
  query apByIdJahr($apId: UUID!, $jahr: Int!) {
    apById(id: $apId) {
      ...ApFields
      aeTaxonomyByArtId {
        ...AeTaxonomiesFields
      }
      popsByApId {
        nodes {
          id
          tpopsByPopId(condition: { apberRelevant: true }) {
            nodes {
              id
              apberRelevant
              firstTpopmassn: tpopmassnsByTpopId(orderBy: DATUM_ASC, first: 1) {
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
      zielsByApId(condition: { jahr: $jahr }) {
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
    jberAbcByApId(jahr: $jahr, apId: $apId) {
      nodes {
        artname
        id
        startJahr
        bearbeiter
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
  ${ap}
  ${apber}
  ${apErfkritWerte}
  ${tpopber}
  ${tpopmassnTypWerte}
  ${ziel}
  ${zielber}
  ${zielTypWerte}
`
