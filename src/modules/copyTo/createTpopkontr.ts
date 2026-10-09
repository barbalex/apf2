import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { gql as dynamicGql } from '../../apolloGql.ts'

import { tpopkontr } from '../../components/shared/fragments.ts'

export const createTpopkontr = dynamicGql`
  mutation createTpopkontr(
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
` as unknown as TypedDocumentNode<
  { createTpopkontr?: { tpopkontr?: { id: string } | null } | null },
  Record<string, unknown>
>
