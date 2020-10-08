import { gql } from '@apollo/client'

import {
  adresse as adresseFragment,
  pop as popFragment,
  tpop as tpopFragment,
  tpopfreiwkontr as tpopfreiwkontrFragment,
  tpopkontrzaehlEinheitWerte as tpopkontrzaehlEinheitWerteFragment,
} from '../../../shared/fragments'

export default gql`
  mutation updateTpopkontrForEkf(
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
    $apberNichtRelevant: Boolean
    $apberNichtRelevantGrund: String
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
          apberNichtRelevant: $apberNichtRelevant
          apberNichtRelevantGrund: $apberNichtRelevantGrund
          ekfBemerkungen: $ekfBemerkungen
          changedBy: $changedBy
        }
      }
    ) {
      tpopkontr {
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
              ekzaehleinheitsByApId {
                nodes {
                  id
                  tpopkontrzaehlEinheitWerteByZaehleinheitId {
                    ...TpopkontrzaehlEinheitWerteFields
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
  ${adresseFragment}
  ${popFragment}
  ${tpopFragment}
  ${tpopfreiwkontrFragment}
  ${tpopkontrzaehlEinheitWerteFragment}
`
