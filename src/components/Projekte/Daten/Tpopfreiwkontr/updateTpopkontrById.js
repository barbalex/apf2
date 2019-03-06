import gql from 'graphql-tag'

import {
  adresse,
  pop,
  tpop,
  tpopfreiwkontr,
  tpopkontrzaehlEinheitWerte,
} from '../../../shared/fragments'

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
        ...TpopfreiwkontrFields
        adresseByBearbeiter {
          ...AdresseFields
        }
        tpopByTpopId {
          ...TpopFields
          popByPopId {
            ...PopFields
            apByApId {
              id
              ekfzaehleinheitsByApId {
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
  ${adresse}
  ${pop}
  ${tpop}
  ${tpopfreiwkontr}
  ${tpopkontrzaehlEinheitWerte}
`
