import React, { useContext, useState, useCallback } from 'react'
import styled from 'styled-components'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import SelectLoadingOptions from '../../../shared/SelectLoadingOptions'
import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'

const AutocompleteContainer = styled.div`
  flex-basis: 450px;
  padding-left: 8px;
  padding-right: 8px;
`

const WollmilchsauSingle = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)

  const { enqueNotification } = store

  const [ewmMessage, setEwmMessage] = useState('')

  const aeTaxonomiesfilter = useCallback(
    (inputValue) =>
      inputValue
        ? {
            artname: { includesInsensitive: inputValue },
            // needed to turn this off because the postgraphile addon caused cors issues in production
            apByArtIdExists: true,
          }
        : { artname: { isNull: false } /*, apByArtIdExists: true*/ },
    [],
  )

  return (
    <AutocompleteContainer>
      <SelectLoadingOptions
        row={{}}
        field="ewm"
        valueLabelPath="aeTaxonomyByArtId.artname"
        label={`"Eier legende Wollmilchsau" für einzelne AP's: AP wählen`}
        labelSize={14}
        saveToDb={async (e) => {
          const aeId = e.target.value
          if (aeId === null) return
          setEwmMessage(
            'Export "anzkontrinklletzterundletztertpopber" wird vorbereitet...',
          )
          let result
          try {
            result = await client.query({
              query: gql`
                query apByArtIdQuery($aeId: UUID!) {
                  apByArtId(artId: $aeId) {
                    id
                  }
                }
              `,
              variables: { aeId },
            })
          } catch (error) {
            enqueNotification({
              message: error.message,
              options: { variant: 'error' },
            })
          }
          const apId = result.data?.apByArtId?.id
          const { data } = await client.query({
            query: gql`
              query tpopErsteUndLetzteKontrolleUndLetzterTpopbersFilteredQuery(
                $apId: UUID!
              ) {
                allTpops(
                  filter: {
                    vTpopErsteUndLetzteKontrolleUndLetzterTpopbersByIdExist: true
                    popByPopId: { apId: { equalTo: $apId } }
                  }
                ) {
                  totalCount
                  nodes {
                    id
                    vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById {
                      nodes {
                        apId
                        familie
                        artname
                        apBearbeitung
                        apStartJahr
                        apUmsetzung
                        popId
                        popNr
                        popName
                        popStatus
                        popBekanntSeit
                        popStatusUnklar
                        popStatusUnklarBegruendung
                        popX
                        popY
                        id
                        nr
                        gemeinde
                        flurname
                        status
                        statusDecodiert
                        bekanntSeit
                        statusUnklar
                        statusUnklarGrund
                        x
                        y
                        radius
                        hoehe
                        exposition
                        klima
                        neigung
                        beschreibung
                        katasterNr
                        apberRelevant
                        apberRelevantGrund
                        eigentuemer
                        kontakt
                        nutzungszone
                        bewirtschafter
                        bewirtschaftung
                        bodenTyp
                        bodenKalkgehalt
                        bodenDurchlaessigkeit
                        bodenHumus
                        bodenNaehrstoffgehalt
                        bodenAbtrag
                        wasserhaushalt
                        ekfrequenz
                        ekfrequenzAbweichend
                        createdAt
                        updatedAt
                        changedBy
                        anzahlKontrollen
                        ersteKontrolleId
                        ersteKontrolleJahr
                        ersteKontrolleDatum
                        ersteKontrolleTyp
                        ersteKontrolleBearbeiter
                        ersteKontrolleUeberlebensrate
                        ersteKontrolleVitalitaet
                        ersteKontrolleEntwicklung
                        ersteKontrolleUrsachen
                        ersteKontrolleErfolgsbeurteilung
                        ersteKontrolleUmsetzungAendern
                        ersteKontrolleKontrolleAendern
                        ersteKontrolleBemerkungen
                        ersteKontrolleLrDelarze
                        ersteKontrolleLrUmgebungDelarze
                        ersteKontrolleVegetationstyp
                        ersteKontrolleKonkurrenz
                        ersteKontrolleMoosschicht
                        ersteKontrolleKrautschicht
                        ersteKontrolleStrauchschicht
                        ersteKontrolleBaumschicht
                        ersteKontrolleIdealbiotopUebereinstimmung
                        ersteKontrolleHandlungsbedarf
                        ersteKontrolleFlaecheUeberprueft
                        ersteKontrolleFlaeche
                        ersteKontrollePlanVorhanden
                        ersteKontrolleDeckungVegetation
                        ersteKontrolleDeckungNackterBoden
                        ersteKontrolleDeckungApArt
                        ersteKontrolleJungpflanzenVorhanden
                        ersteKontrolleVegetationshoeheMaximum
                        ersteKontrolleVegetationshoeheMittel
                        ersteKontrolleGefaehrdung
                        ersteKontrolleCreatedAt
                        ersteKontrolleUpdatedAt
                        ersteKontrolleChangedBy
                        ersteKontrolleApberNichtRelevant
                        ersteKontrolleApberNichtRelevantGrund
                        ersteKontrolleEkfBemerkungen
                        ersteKontrolleZaehlungAnzahlen
                        ersteKontrolleZaehlungEinheiten
                        ersteKontrolleZaehlungMethoden
                        letzteKontrolleId
                        letzteKontrolleJahr
                        letzteKontrolleDatum
                        letzteKontrolleTyp
                        letzteKontrolleBearbeiter
                        letzteKontrolleUeberlebensrate
                        letzteKontrolleVitalitaet
                        letzteKontrolleEntwicklung
                        letzteKontrolleUrsachen
                        letzteKontrolleErfolgsbeurteilung
                        letzteKontrolleUmsetzungAendern
                        letzteKontrolleKontrolleAendern
                        letzteKontrolleBemerkungen
                        letzteKontrolleLrDelarze
                        letzteKontrolleLrUmgebungDelarze
                        letzteKontrolleVegetationstyp
                        letzteKontrolleKonkurrenz
                        letzteKontrolleMoosschicht
                        letzteKontrolleKrautschicht
                        letzteKontrolleStrauchschicht
                        letzteKontrolleBaumschicht
                        letzteKontrolleIdealbiotopUebereinstimmung
                        letzteKontrolleHandlungsbedarf
                        letzteKontrolleFlaecheUeberprueft
                        letzteKontrolleFlaeche
                        letzteKontrollePlanVorhanden
                        letzteKontrolleDeckungVegetation
                        letzteKontrolleDeckungNackterBoden
                        letzteKontrolleDeckungApArt
                        letzteKontrolleJungpflanzenVorhanden
                        letzteKontrolleVegetationshoeheMaximum
                        letzteKontrolleVegetationshoeheMittel
                        letzteKontrolleGefaehrdung
                        letzteKontrolleCreatedAt
                        letzteKontrolleUpdatedAt
                        letzteKontrolleChangedBy
                        letzteKontrolleApberNichtRelevant
                        letzteKontrolleApberNichtRelevantGrund
                        letzteKontrolleEkfBemerkungen
                        letzteKontrolleZaehlungAnzahlen
                        letzteKontrolleZaehlungEinheiten
                        letzteKontrolleZaehlungMethoden
                        tpopberAnz
                        tpopberId
                        tpopberJahr
                        tpopberEntwicklung
                        tpopberBemerkungen
                        tpopberCreatedAt
                        tpopberUpdatedAt
                        tpopberChangedBy
                      }
                    }
                  }
                }
              }
            `,
            variables: { apId },
          })
          const rows = (data?.allTpops?.nodes ?? []).map((n) => ({
            ap_id:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.apId ?? '',
            familie:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.familie ?? '',
            artname:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.artname ?? '',
            ap_bearbeitung:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.apBearbeitung ?? '',
            ap_start_jahr:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.apStartJahr ?? '',
            ap_umsetzung:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.apUmsetzung ?? '',
            pop_id:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.popId ?? '',
            pop_nr:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.popNr ?? '',
            pop_name:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.popName ?? '',
            pop_status:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.popStatus ?? '',
            pop_bekannt_seit:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.popBekanntSeit ?? '',
            pop_status_unklar:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.popStatusUnklar ?? '',
            pop_status_unklar_begruendung:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.popStatusUnklarBegruendung ?? '',
            pop_x:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.popX ?? '',
            pop_y:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.popY ?? '',
            id:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.id ?? '',
            nr:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.nr ?? '',
            gemeinde:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.gemeinde ?? '',
            flurname:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.flurname ?? '',
            status:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.status ?? '',
            status_decodiert:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.statusDecodiert ?? '',
            bekannt_seit:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.bekanntSeit ?? '',
            status_unklar:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.statusUnklar ?? '',
            status_unklar_grund:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.statusUnklarGrund ?? '',
            lv95X:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.x ?? '',
            lv95Y:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.y ?? '',
            radius:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.radius ?? '',
            hoehe:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.hoehe ?? '',
            exposition:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.exposition ?? '',
            klima:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.klima ?? '',
            neigung:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.neigung ?? '',
            beschreibung:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.beschreibung ?? '',
            kataster_nr:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.katasterNr ?? '',
            apber_relevant:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.apberRelevant ?? '',
            apber_relevant_grund:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.apberRelevantGrund ?? '',
            eigentuemer:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.eigentuemer ?? '',
            kontakt:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.kontakt ?? '',
            nutzungszone:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.nutzungszone ?? '',
            bewirtschafter:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.bewirtschafter ?? '',
            bewirtschaftung:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.bewirtschaftung ?? '',
            ekfrequenz:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ekfrequenz ?? '',
            ekfrequenz_abweichend:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ekfrequenzAbweichend ?? '',
            created_at:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.createdAt ?? '',
            updated_at:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.updatedAt ?? '',
            changed_by:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.changedBy ?? '',
            anzahl_kontrollen:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.anzahlKontrollen ?? '',
            erste_kontrolle_id:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleId ?? '',
            erste_kontrolle_jahr:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleJahr ?? '',
            erste_kontrolle_datum:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleDatum ?? '',
            erste_kontrolle_typ:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleTyp ?? '',
            erste_kontrolle_bearbeiter:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleBearbeiter ?? '',
            erste_kontrolle_ueberlebensrate:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleUeberlebensrate ?? '',
            erste_kontrolle_vitalitaet:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleVitalitaet ?? '',
            erste_kontrolle_entwicklung:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleEntwicklung ?? '',
            erste_kontrolle_ursachen:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleUrsachen ?? '',
            erste_kontrolle_erfolgsbeurteilung:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleErfolgsbeurteilung ?? '',
            erste_kontrolle_umsetzung_aendern:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleUmsetzungAendern ?? '',
            erste_kontrolle_kontrolle_aendern:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleKontrolleAendern ?? '',
            erste_kontrolle_bemerkungen:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleBemerkungen ?? '',
            erste_kontrolle_lr_delarze:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleLrDelarze ?? '',
            erste_kontrolle_lr_umgebung_delarze:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleLrUmgebungDelarze ?? '',
            erste_kontrolle_vegetationstyp:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleVegetationstyp ?? '',
            erste_kontrolle_konkurrenz:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleKonkurrenz ?? '',
            erste_kontrolle_moosschicht:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleMoosschicht ?? '',
            erste_kontrolle_krautschicht:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleKrautschicht ?? '',
            erste_kontrolle_strauchschicht:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleStrauchschicht ?? '',
            erste_kontrolle_baumschicht:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleBaumschicht ?? '',
            erste_kontrolle_idealbiotop_uebereinstimmung:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleIdealbiotopUebereinstimmung ?? '',
            erste_kontrolle_handlungsbedarf:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleHandlungsbedarf ?? '',
            erste_kontrolle_flaeche_ueberprueft:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleFlaecheUeberprueft ?? '',
            erste_kontrolle_flaeche:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleFlaeche ?? '',
            erste_kontrolle_plan_vorhanden:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrollePlanVorhanden ?? '',
            erste_kontrolle_deckung_vegetation:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleDeckungVegetation ?? '',
            erste_kontrolle_deckung_nackter_boden:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleDeckungNackterBoden ?? '',
            erste_kontrolle_deckung_ap_art:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleDeckungApArt ?? '',
            erste_kontrolle_jungpflanzen_vorhanden:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleJungpflanzenVorhanden ?? '',
            erste_kontrolle_vegetationshoehe_maximum:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleVegetationshoeheMaximum ?? '',
            erste_kontrolle_vegetationshoehe_mittel:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleVegetationshoeheMittel ?? '',
            erste_kontrolle_gefaehrdung:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleGefaehrdung ?? '',
            erste_kontrolle_created_at:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleCreatedAt ?? '',
            erste_kontrolle_updated_at:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleUpdatedAt ?? '',
            erste_kontrolle_changed_by:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleChangedBy ?? '',
            erste_kontrolle_apber_nicht_relevant:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleApberNichtRelevant ?? '',
            erste_kontrolle_apber_nicht_relevant_grund:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleApberNichtRelevantGrund ?? '',
            erste_kontrolle_ekf_bemerkungen:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleEkfBemerkungen ?? '',
            erste_kontrolle_zaehlung_anzahlen:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleZaehlungAnzahlen ?? '',
            erste_kontrolle_zaehlung_einheiten:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleZaehlungEinheiten ?? '',
            erste_kontrolle_zaehlung_methoden:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.ersteKontrolleZaehlungMethoden ?? '',
            letzte_kontrolle_id:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleId ?? '',
            letzte_kontrolle_jahr:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleJahr ?? '',
            letzte_kontrolle_datum:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleDatum ?? '',
            letzte_kontrolle_typ:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleTyp ?? '',
            letzte_kontrolle_bearbeiter:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleBearbeiter ?? '',
            letzte_kontrolle_ueberlebensrate:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleUeberlebensrate ?? '',
            letzte_kontrolle_vitalitaet:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleVitalitaet ?? '',
            letzte_kontrolle_entwicklung:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleEntwicklung ?? '',
            letzte_kontrolle_ursachen:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleUrsachen ?? '',
            letzte_kontrolle_erfolgsbeurteilung:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleErfolgsbeurteilung ?? '',
            letzte_kontrolle_umsetzung_aendern:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleUmsetzungAendern ?? '',
            letzte_kontrolle_kontrolle_aendern:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleKontrolleAendern ?? '',
            letzte_kontrolle_bemerkungen:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleBemerkungen ?? '',
            letzte_kontrolle_lr_delarze:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleLrDelarze ?? '',
            letzte_kontrolle_lr_umgebung_delarze:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleLrUmgebungDelarze ?? '',
            letzte_kontrolle_vegetationstyp:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleVegetationstyp ?? '',
            letzte_kontrolle_konkurrenz:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleKonkurrenz ?? '',
            letzte_kontrolle_moosschicht:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleMoosschicht ?? '',
            letzte_kontrolle_krautschicht:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleKrautschicht ?? '',
            letzte_kontrolle_strauchschicht:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleStrauchschicht ?? '',
            letzte_kontrolle_baumschicht:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleBaumschicht ?? '',
            letzte_kontrolle_idealbiotop_uebereinstimmung:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleIdealbiotopUebereinstimmung ?? '',
            letzte_kontrolle_handlungsbedarf:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleHandlungsbedarf ?? '',
            letzte_kontrolle_flaeche_ueberprueft:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleFlaecheUeberprueft ?? '',
            letzte_kontrolle_flaeche:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleFlaeche ?? '',
            letzte_kontrolle_plan_vorhanden:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrollePlanVorhanden ?? '',
            letzte_kontrolle_deckung_vegetation:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleDeckungVegetation ?? '',
            letzte_kontrolle_deckung_nackter_boden:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleDeckungNackterBoden ?? '',
            letzte_kontrolle_deckung_ap_art:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleDeckungApArt ?? '',
            letzte_kontrolle_jungpflanzen_vorhanden:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleJungpflanzenVorhanden ?? '',
            letzte_kontrolle_vegetationshoehe_maximum:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleVegetationshoeheMaximum ?? '',
            letzte_kontrolle_vegetationshoehe_mittel:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleVegetationshoeheMittel ?? '',
            letzte_kontrolle_gefaehrdung:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleGefaehrdung ?? '',
            letzte_kontrolle_changed:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleChanged ?? '',
            letzte_kontrolle_changed_by:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleChangedBy ?? '',
            letzte_kontrolle_apber_nicht_relevant:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleApberNichtRelevant ?? '',
            letzte_kontrolle_apber_nicht_relevant_grund:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleApberNichtRelevantGrund ?? '',
            letzte_kontrolle_ekf_bemerkungen:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleEkfBemerkungen ?? '',
            letzte_kontrolle_zaehlung_anzahlen:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleZaehlungAnzahlen ?? '',
            letzte_kontrolle_zaehlung_einheiten:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleZaehlungEinheiten ?? '',
            letzte_kontrolle_zaehlung_methoden:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.letzteKontrolleZaehlungMethoden ?? '',
            tpopber_anz:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.tpopberAnz ?? '',
            tpopber_id:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.tpopberId ?? '',
            tpopber_jahr:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.tpopberJahr ?? '',
            tpopber_entwicklung:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.tpopberEntwicklung ?? '',
            tpopber_bemerkungen:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.tpopberBemerkungen ?? '',
            tpopber_created_at:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.tpopberCreatedAt ?? '',
            tpopber_updated_at:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.tpopberUpdatedAt ?? '',
            tpopber_changed_by:
              n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById?.nodes?.[0]
                ?.tpopberChangedBy ?? '',
          }))
          setEwmMessage('')
          if (rows.length === 0) {
            return enqueNotification({
              message: 'Die Abfrage retournierte 0 Datensätze',
              options: {
                variant: 'warning',
              },
            })
          }
          exportModule({
            data: sortBy(rows, ['artname', 'pop_nr', 'nr']),
            fileName: 'anzkontrinklletzterundletztertpopber',
            store,
          })
        }}
        query={gql`
          query allAeTaxonomiesQuery($filter: AeTaxonomyFilter!) {
            allAeTaxonomies(first: 8, filter: $filter, orderBy: ARTNAME_ASC) {
              nodes {
                value: id
                label: artname
              }
            }
          }
        `}
        filter={aeTaxonomiesfilter}
        queryNodesName="allAeTaxonomies"
        error={ewmMessage}
      />
    </AutocompleteContainer>
  )
}

export default observer(WollmilchsauSingle)
