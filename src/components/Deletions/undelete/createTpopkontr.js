import gql from 'graphql-tag'

import { tpopkontr } from '../../shared/fragments'

export default gql`
  mutation createTpopkontr(
    $id: UUID
    $typ: String
    $datum: Date
    $jahr: Int
    $vitalitaet: String
    $ueberlebensrate: Int
    $entwicklung: Int
    $ursachen: String
    $erfolgsbeurteilung: String
    $umsetzungAendern: String
    $kontrolleAendern: String
    $bemerkungen: String
    $lrDelarze: String
    $flaeche: Int
    $lrUmgebungDelarze: String
    $vegetationstyp: String
    $konkurrenz: String
    $moosschicht: String
    $krautschicht: String
    $strauchschicht: String
    $baumschicht: String
    $bodenTyp: String
    $bodenKalkgehalt: String
    $bodenDurchlaessigkeit: String
    $bodenHumus: String
    $bodenNaehrstoffgehalt: String
    $bodenAbtrag: String
    $wasserhaushalt: String
    $idealbiotopUebereinstimmung: Int
    $handlungsbedarf: String
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
  ) {
    createTpopkontr(
      input: {
        tpopkontr: {
          id: $id
          typ: $typ
          datum: $datum
          jahr: $jahr
          vitalitaet: $vitalitaet
          ueberlebensrate: $ueberlebensrate
          entwicklung: $entwicklung
          ursachen: $ursachen
          erfolgsbeurteilung: $erfolgsbeurteilung
          umsetzungAendern: $umsetzungAendern
          kontrolleAendern: $kontrolleAendern
          bemerkungen: $bemerkungen
          lrDelarze: $lrDelarze
          flaeche: $flaeche
          lrUmgebungDelarze: $lrUmgebungDelarze
          vegetationstyp: $vegetationstyp
          konkurrenz: $konkurrenz
          moosschicht: $moosschicht
          krautschicht: $krautschicht
          strauchschicht: $strauchschicht
          baumschicht: $baumschicht
          bodenTyp: $bodenTyp
          bodenKalkgehalt: $bodenKalkgehalt
          bodenDurchlaessigkeit: $bodenDurchlaessigkeit
          bodenHumus: $bodenHumus
          bodenNaehrstoffgehalt: $bodenNaehrstoffgehalt
          bodenAbtrag: $bodenAbtrag
          wasserhaushalt: $wasserhaushalt
          idealbiotopUebereinstimmung: $idealbiotopUebereinstimmung
          handlungsbedarf: $handlungsbedarf
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
        }
      }
    ) {
      tpopkontr {
        ...TpopkontrFields
      }
    }
  }
  ${tpopkontr}
`
