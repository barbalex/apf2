// @flow
import gql from 'graphql-tag'

import { aeEigenschaften, adresse } from '../../../shared/fragments'

export default gql`
  query tpopkontrByIdQuery($id: UUID!, $showFilter: Boolean!) {
    tpopkontrById(id: $id) {
      id
      typ
      ekfVerifiziert
      ekfBemerkungen
      datum
      jahr
      bemerkungen
      flaecheUeberprueft
      deckungVegetation
      deckungNackterBoden
      deckungApArt
      vegetationshoeheMaximum
      vegetationshoeheMittel
      gefaehrdung
      tpopId
      bearbeiter
      adresseByBearbeiter {
        ...AdresseFields
        usersByAdresseId {
          totalCount
        }
      }
      planVorhanden
      jungpflanzenVorhanden
      tpopByTpopId {
        id
        nr
        flurname
        x
        y
        status
        popByPopId {
          id
          apId
          nr
          name
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
        id
        typ
        ekfVerifiziert
        ekfBemerkungen
        datum
        jahr
        bemerkungen
        flaecheUeberprueft
        deckungVegetation
        deckungNackterBoden
        deckungApArt
        vegetationshoeheMaximum
        vegetationshoeheMittel
        gefaehrdung
        tpopId
        bearbeiter
        planVorhanden
        jungpflanzenVorhanden
      }
    }
  }
  ${aeEigenschaften}
  ${adresse}
`
