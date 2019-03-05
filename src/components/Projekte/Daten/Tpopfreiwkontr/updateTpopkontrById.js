import gql from 'graphql-tag'

import { adresse } from '../../../shared/fragments'

export default gql`
  mutation updateTpopkontr(
    $id: UUID!
    $typ: String
    $datum: Date
    $jahr: Int
    $bemerkungen: String
    $flaecheUeberprueft: Int
    $deckungVegetation: Int
    $deckungNackterBoden: Int
    $deckungApArt: Int
    $vegetationshoeheMaximum: Int
    $vegetationshoeheMittel: Int
    $gefaehrdung: String
    $tpopId: UUID
    $bearbeiter: UUID
    $planVorhanden: Boolean
    $jungpflanzenVorhanden: Boolean
    $ekfVerifiziert: Boolean
    $ekfBemerkungen: String
    $changedBy: String
  ) {
    updateTpopkontrById(
      input: {
        id: $id
        tpopkontrPatch: {
          typ: $typ
          datum: $datum
          jahr: $jahr
          bemerkungen: $bemerkungen
          flaecheUeberprueft: $flaecheUeberprueft
          deckungVegetation: $deckungVegetation
          deckungNackterBoden: $deckungNackterBoden
          deckungApArt: $deckungApArt
          vegetationshoeheMaximum: $vegetationshoeheMaximum
          vegetationshoeheMittel: $vegetationshoeheMittel
          gefaehrdung: $gefaehrdung
          tpopId: $tpopId
          bearbeiter: $bearbeiter
          planVorhanden: $planVorhanden
          jungpflanzenVorhanden: $jungpflanzenVorhanden
          ekfVerifiziert: $ekfVerifiziert
          ekfBemerkungen: $ekfBemerkungen
          changedBy: $changedBy
        }
      }
    ) {
      tpopkontr {
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
        }
        planVorhanden
        jungpflanzenVorhanden
        changedBy
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
    }
  }
  ${adresse}
`
