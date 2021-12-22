import React, { useContext, useState, useCallback } from 'react'
import styled from 'styled-components'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client'
import { useSnackbar } from 'notistack'

import SelectLoadingOptions from '../../../shared/SelectLoadingOptions'
import exportModule from '../../../../modules/export'
import queryAeTaxonomies from './queryAeTaxonomies'
import storeContext from '../../../../storeContext'
import TPop from './TPop'
import Wollmilchsau from './Wollmilchsau'
import { StyledCardContent, DownloadCardButton } from '../index'

const AutocompleteContainer = styled.div`
  flex-basis: 450px;
  padding-left: 16px;
`

const Teilpopulationen = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)

  const { enqueNotification, removeNotification } = store

  const { closeSnackbar } = useSnackbar()
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
    <StyledCardContent>
      <TPop />
      <DownloadCardButton
        color="inherit"
        onClick={async () => {
          const notif = enqueNotification({
            message: `Export "TeilpopulationenWebGisBun" wird vorbereitet...`,
            options: {
              variant: 'info',
              persist: true,
            },
          })
          let result
          try {
            result = await client.query({
              query: await import('./allVTpopWebgisbuns').then(
                (m) => m.default,
              ),
            })
          } catch (error) {
            enqueNotification({
              message: error.message,
              options: { variant: 'error' },
            })
          }
          const rows = result.data?.allVTpopWebgisbuns?.nodes ?? []
          removeNotification(notif)
          closeSnackbar(notif)
          if (rows.length === 0) {
            return enqueNotification({
              message: 'Die Abfrage retournierte 0 Datensätze',
              options: {
                variant: 'warning',
              },
            })
          }
          exportModule({
            data: rows,
            fileName: 'TeilpopulationenWebGisBun',
            idKey: 'TPOPID',
            xKey: 'TPOP_WGS84LAT',
            yKey: 'TPOP_WGS84LONG',
            store,
          })
        }}
      >
        Teilpopulationen für WebGIS BUN
      </DownloadCardButton>
      <DownloadCardButton
        color="inherit"
        onClick={async () => {
          const notif = enqueNotification({
            message: `Export "Teilpopulationen" wird vorbereitet...`,
            options: {
              variant: 'info',
              persist: true,
            },
          })
          let result
          try {
            result = await client.query({
              query: await import('./queryTpopKml').then((m) => m.default),
            })
          } catch (error) {
            enqueNotification({
              message: error.message,
              options: { variant: 'error' },
            })
          }
          const rows = (result.data?.allTpops?.nodes ?? []).map((z) => ({
            art: z?.vTpopKmlsById?.nodes?.[0]?.art ?? '',
            label: z?.vTpopKmlsById?.nodes?.[0]?.label ?? '',
            inhalte: z?.vTpopKmlsById?.nodes?.[0]?.inhalte ?? '',
            id: z?.vTpopKmlsById?.nodes?.[0]?.id ?? '',
            wgs84Lat: z?.vTpopKmlsById?.nodes?.[0]?.wgs84Lat ?? '',
            wgs84Long: z?.vTpopKmlsById?.nodes?.[0]?.wgs84Long ?? '',
            url: z?.vTpopKmlsById?.nodes?.[0]?.url ?? '',
          }))
          removeNotification(notif)
          closeSnackbar(notif)
          if (rows.length === 0) {
            return enqueNotification({
              message: 'Die Abfrage retournierte 0 Datensätze',
              options: {
                variant: 'warning',
              },
            })
          }
          exportModule({
            data: sortBy(rows, ['art', 'label']),
            fileName: 'Teilpopulationen',
            store,
            kml: true,
          })
        }}
      >
        <div>Teilpopulationen für Google Earth</div>
        <div>(beschriftet mit PopNr/TPopNr)</div>
      </DownloadCardButton>
      <DownloadCardButton
        color="inherit"
        onClick={async () => {
          const notif = enqueNotification({
            message: `Export "TeilpopulationenNachNamen" wird vorbereitet...`,
            options: {
              variant: 'info',
              persist: true,
            },
          })
          let result
          try {
            result = await client.query({
              query: await import('./queryTpopKmlNamen').then((m) => m.default),
            })
          } catch (error) {
            enqueNotification({
              message: error.message,
              options: { variant: 'error' },
            })
          }
          const rows = (result.data?.allTpops?.nodes ?? []).map((z) => ({
            art: z?.vTpopKmlnamenById?.nodes?.[0]?.art ?? '',
            label: z?.vTpopKmlnamenById?.nodes?.[0]?.label ?? '',
            inhalte: z?.vTpopKmlnamenById?.nodes?.[0]?.inhalte ?? '',
            id: z?.vTpopKmlnamenById?.nodes?.[0]?.id ?? '',
            wgs84Lat: z?.vTpopKmlnamenById?.nodes?.[0]?.wgs84Lat ?? '',
            wgs84Long: z?.vTpopKmlnamenById?.nodes?.[0]?.wgs84Long ?? '',
            url: z?.vTpopKmlnamenById?.nodes?.[0]?.url ?? '',
          }))
          removeNotification(notif)
          closeSnackbar(notif)
          if (rows.length === 0) {
            return enqueNotification({
              message: 'Die Abfrage retournierte 0 Datensätze',
              options: {
                variant: 'warning',
              },
            })
          }
          exportModule({
            data: sortBy(rows, ['art', 'label']),
            fileName: 'TeilpopulationenNachNamen',
            store,
            kml: true,
          })
        }}
      >
        <div>Teilpopulationen für Google Earth</div>
        <div>(beschriftet mit Artname, PopNr/TPopNr)</div>
      </DownloadCardButton>
      <DownloadCardButton
        color="inherit"
        onClick={async () => {
          const notif = enqueNotification({
            message: `Export "TeilpopulationenVonApArtenOhneBekanntSeit" wird vorbereitet...`,
            options: {
              variant: 'info',
              persist: true,
            },
          })
          let result
          try {
            result = await client.query({
              query: await import('./allVTpopOhnebekanntseits').then(
                (m) => m.default,
              ),
            })
          } catch (error) {
            enqueNotification({
              message: error.message,
              options: { variant: 'error' },
            })
          }
          const rows = result.data?.allVTpopOhnebekanntseits?.nodes ?? []
          removeNotification(notif)
          closeSnackbar(notif)
          if (rows.length === 0) {
            return enqueNotification({
              message: 'Die Abfrage retournierte 0 Datensätze',
              options: {
                variant: 'warning',
              },
            })
          }
          exportModule({
            data: rows,
            fileName: 'TeilpopulationenVonApArtenOhneBekanntSeit',
            store,
          })
        }}
      >
        <div>Teilpopulationen von AP-Arten</div>
        <div>{'ohne "Bekannt seit"'}</div>
      </DownloadCardButton>
      <DownloadCardButton
        color="inherit"
        onClick={async () => {
          const notif = enqueNotification({
            message: `Export "TeilpopulationenOhneApBerichtRelevant" wird vorbereitet...`,
            options: {
              variant: 'info',
              persist: true,
            },
          })
          let result
          try {
            result = await client.query({
              query: await import('./allVTpopOhneapberichtrelevants').then(
                (m) => m.default,
              ),
            })
          } catch (error) {
            enqueNotification({
              message: error.message,
              options: { variant: 'error' },
            })
          }
          const rows = result.data?.allVTpopOhneapberichtrelevants?.nodes ?? []
          removeNotification(notif)
          closeSnackbar(notif)
          if (rows.length === 0) {
            return enqueNotification({
              message: 'Die Abfrage retournierte 0 Datensätze',
              options: {
                variant: 'warning',
              },
            })
          }
          exportModule({
            data: rows,
            fileName: 'TeilpopulationenOhneApBerichtRelevant',
            store,
          })
        }}
      >
        <div>Teilpopulationen ohne Eintrag</div>
        <div>{'im Feld "Für AP-Bericht relevant"'}</div>
      </DownloadCardButton>
      <DownloadCardButton
        color="inherit"
        onClick={async () => {
          const notif = enqueNotification({
            message: `Export "TeilpopulationenAnzahlMassnahmen" wird vorbereitet...`,
            options: {
              variant: 'info',
              persist: true,
            },
          })
          let result
          try {
            result = await client.query({
              query: await import('./queryTpopAnzMassns').then(
                (m) => m.default,
              ),
            })
          } catch (error) {
            enqueNotification({
              message: error.message,
              options: { variant: 'error' },
            })
          }
          const rows = (result.data?.allTpops?.nodes ?? []).map((n) => ({
            ap_id: n?.vTpopAnzmassnsById?.nodes?.[0]?.apId ?? '',
            familie: n?.vTpopAnzmassnsById?.nodes?.[0]?.familie ?? '',
            artname: n?.vTpopAnzmassnsById?.nodes?.[0]?.artname ?? '',
            ap_bearbeitung:
              n?.vTpopAnzmassnsById?.nodes?.[0]?.apBearbeitung ?? '',
            ap_start_jahr: n?.vTpopAnzmassnsById?.nodes?.[0]?.apStartJahr ?? '',
            ap_umsetzung: n?.vTpopAnzmassnsById?.nodes?.[0]?.apUmsetzung ?? '',
            pop_id: n?.vTpopAnzmassnsById?.nodes?.[0]?.popId ?? '',
            pop_nr: n?.vTpopAnzmassnsById?.nodes?.[0]?.popNr ?? '',
            pop_name: n?.vTpopAnzmassnsById?.nodes?.[0]?.popName ?? '',
            pop_status: n?.vTpopAnzmassnsById?.nodes?.[0]?.popStatus ?? '',
            pop_bekannt_seit:
              n?.vTpopAnzmassnsById?.nodes?.[0]?.popBekanntSeit ?? '',
            pop_status_unklar:
              n?.vTpopAnzmassnsById?.nodes?.[0]?.popStatusUnklar ?? '',
            pop_status_unklar_begruendung:
              n?.vTpopAnzmassnsById?.nodes?.[0]?.popStatusUnklarBegruendung ??
              '',
            pop_x: n?.vTpopAnzmassnsById?.nodes?.[0]?.popX ?? '',
            pop_y: n?.vTpopAnzmassnsById?.nodes?.[0]?.popY ?? '',
            id: n?.vTpopAnzmassnsById?.nodes?.[0]?.id ?? '',
            nr: n?.vTpopAnzmassnsById?.nodes?.[0]?.nr ?? '',
            gemeinde: n?.vTpopAnzmassnsById?.nodes?.[0]?.gemeinde ?? '',
            flurname: n?.vTpopAnzmassnsById?.nodes?.[0]?.flurname ?? '',
            status: n?.vTpopAnzmassnsById?.nodes?.[0]?.status ?? '',
            bekannt_seit: n?.vTpopAnzmassnsById?.nodes?.[0]?.bekanntSeit ?? '',
            status_unklar:
              n?.vTpopAnzmassnsById?.nodes?.[0]?.statusUnklar ?? '',
            status_unklar_grund:
              n?.vTpopAnzmassnsById?.nodes?.[0]?.statusUnklarGrund ?? '',
            lv95X: n?.vTpopAnzmassnsById?.nodes?.[0]?.x ?? '',
            lv95Y: n?.vTpopAnzmassnsById?.nodes?.[0]?.y ?? '',
            radius: n?.vTpopAnzmassnsById?.nodes?.[0]?.radius ?? '',
            hoehe: n?.vTpopAnzmassnsById?.nodes?.[0]?.hoehe ?? '',
            exposition: n?.vTpopAnzmassnsById?.nodes?.[0]?.exposition ?? '',
            klima: n?.vTpopAnzmassnsById?.nodes?.[0]?.klima ?? '',
            neigung: n?.vTpopAnzmassnsById?.nodes?.[0]?.neigung ?? '',
            beschreibung: n?.vTpopAnzmassnsById?.nodes?.[0]?.beschreibung ?? '',
            kataster_nr: n?.vTpopAnzmassnsById?.nodes?.[0]?.katasterNr ?? '',
            apber_relevant:
              n?.vTpopAnzmassnsById?.nodes?.[0]?.apberRelevant ?? '',
            apber_relevant_grund:
              n?.vTpopAnzmassnsById?.nodes?.[0]?.apberRelevantGrund ?? '',
            eigentuemer: n?.vTpopAnzmassnsById?.nodes?.[0]?.eigentuemer ?? '',
            kontakt: n?.vTpopAnzmassnsById?.nodes?.[0]?.kontakt ?? '',
            nutzungszone: n?.vTpopAnzmassnsById?.nodes?.[0]?.nutzungszone ?? '',
            bewirtschafter:
              n?.vTpopAnzmassnsById?.nodes?.[0]?.bewirtschafter ?? '',
            ekfrequenz: n?.vTpopAnzmassnsById?.nodes?.[0]?.ekfrequenz ?? '',
            ekfrequenz_abweichend:
              n?.vTpopAnzmassnsById?.nodes?.[0]?.ekfrequenzAbweichend ?? '',
            anzahlMassnahmen:
              n?.vTpopAnzmassnsById?.nodes?.[0]?.anzahlMassnahmen ?? '',
          }))
          removeNotification(notif)
          closeSnackbar(notif)
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
            fileName: 'TeilpopulationenAnzahlMassnahmen',
            store,
          })
        }}
      >
        Anzahl Massnahmen pro Teilpopulation
      </DownloadCardButton>
      <Wollmilchsau />
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
                query: await import('./queryApByArtId').then((m) => m.default),
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
              query: await import(
                './queryTpopErsteUndLetzteKontrolleUndLetzterTpopberFiltered'
              ).then((m) => m.default),
              variables: { apId },
            })
            const rows = (data?.allTpops?.nodes ?? []).map((n) => ({
              ap_id:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.apId ?? '',
              familie:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.familie ?? '',
              artname:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.artname ?? '',
              ap_bearbeitung:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.apBearbeitung ?? '',
              ap_start_jahr:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.apStartJahr ?? '',
              ap_umsetzung:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.apUmsetzung ?? '',
              pop_id:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.popId ?? '',
              pop_nr:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.popNr ?? '',
              pop_name:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.popName ?? '',
              pop_status:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.popStatus ?? '',
              pop_bekannt_seit:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.popBekanntSeit ?? '',
              pop_status_unklar:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.popStatusUnklar ?? '',
              pop_status_unklar_begruendung:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.popStatusUnklarBegruendung ?? '',
              pop_x:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.popX ?? '',
              pop_y:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.popY ?? '',
              id:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.id ?? '',
              nr:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.nr ?? '',
              gemeinde:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.gemeinde ?? '',
              flurname:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.flurname ?? '',
              status:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.status ?? '',
              status_decodiert:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.statusDecodiert ?? '',
              bekannt_seit:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.bekanntSeit ?? '',
              status_unklar:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.statusUnklar ?? '',
              status_unklar_grund:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.statusUnklarGrund ?? '',
              lv95X:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.x ?? '',
              lv95Y:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.y ?? '',
              radius:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.radius ?? '',
              hoehe:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.hoehe ?? '',
              exposition:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.exposition ?? '',
              klima:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.klima ?? '',
              neigung:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.neigung ?? '',
              beschreibung:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.beschreibung ?? '',
              kataster_nr:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.katasterNr ?? '',
              apber_relevant:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.apberRelevant ?? '',
              apber_relevant_grund:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.apberRelevantGrund ?? '',
              eigentuemer:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.eigentuemer ?? '',
              kontakt:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.kontakt ?? '',
              nutzungszone:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.nutzungszone ?? '',
              bewirtschafter:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.bewirtschafter ?? '',
              bewirtschaftung:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.bewirtschaftung ?? '',
              ekfrequenz:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ekfrequenz ?? '',
              ekfrequenz_abweichend:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ekfrequenzAbweichend ?? '',
              created_at:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.createdAt ?? '',
              updated_at:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.updatedAt ?? '',
              changed_by:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.changedBy ?? '',
              anzahl_kontrollen:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.anzahlKontrollen ?? '',
              erste_kontrolle_id:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleId ?? '',
              erste_kontrolle_jahr:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleJahr ?? '',
              erste_kontrolle_datum:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleDatum ?? '',
              erste_kontrolle_typ:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleTyp ?? '',
              erste_kontrolle_bearbeiter:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleBearbeiter ?? '',
              erste_kontrolle_ueberlebensrate:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleUeberlebensrate ?? '',
              erste_kontrolle_vitalitaet:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleVitalitaet ?? '',
              erste_kontrolle_entwicklung:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleEntwicklung ?? '',
              erste_kontrolle_ursachen:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleUrsachen ?? '',
              erste_kontrolle_erfolgsbeurteilung:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleErfolgsbeurteilung ?? '',
              erste_kontrolle_umsetzung_aendern:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleUmsetzungAendern ?? '',
              erste_kontrolle_kontrolle_aendern:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleKontrolleAendern ?? '',
              erste_kontrolle_bemerkungen:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleBemerkungen ?? '',
              erste_kontrolle_lr_delarze:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleLrDelarze ?? '',
              erste_kontrolle_lr_umgebung_delarze:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleLrUmgebungDelarze ?? '',
              erste_kontrolle_vegetationstyp:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleVegetationstyp ?? '',
              erste_kontrolle_konkurrenz:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleKonkurrenz ?? '',
              erste_kontrolle_moosschicht:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleMoosschicht ?? '',
              erste_kontrolle_krautschicht:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleKrautschicht ?? '',
              erste_kontrolle_strauchschicht:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleStrauchschicht ?? '',
              erste_kontrolle_baumschicht:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleBaumschicht ?? '',
              erste_kontrolle_idealbiotop_uebereinstimmung:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleIdealbiotopUebereinstimmung ?? '',
              erste_kontrolle_handlungsbedarf:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleHandlungsbedarf ?? '',
              erste_kontrolle_flaeche_ueberprueft:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleFlaecheUeberprueft ?? '',
              erste_kontrolle_flaeche:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleFlaeche ?? '',
              erste_kontrolle_plan_vorhanden:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrollePlanVorhanden ?? '',
              erste_kontrolle_deckung_vegetation:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleDeckungVegetation ?? '',
              erste_kontrolle_deckung_nackter_boden:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleDeckungNackterBoden ?? '',
              erste_kontrolle_deckung_ap_art:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleDeckungApArt ?? '',
              erste_kontrolle_jungpflanzen_vorhanden:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleJungpflanzenVorhanden ?? '',
              erste_kontrolle_vegetationshoehe_maximum:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleVegetationshoeheMaximum ?? '',
              erste_kontrolle_vegetationshoehe_mittel:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleVegetationshoeheMittel ?? '',
              erste_kontrolle_gefaehrdung:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleGefaehrdung ?? '',
              erste_kontrolle_created_at:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleCreatedAt ?? '',
              erste_kontrolle_updated_at:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleUpdatedAt ?? '',
              erste_kontrolle_changed_by:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleChangedBy ?? '',
              erste_kontrolle_apber_nicht_relevant:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleApberNichtRelevant ?? '',
              erste_kontrolle_apber_nicht_relevant_grund:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleApberNichtRelevantGrund ?? '',
              erste_kontrolle_ekf_bemerkungen:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleEkfBemerkungen ?? '',
              erste_kontrolle_zaehlung_anzahlen:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleZaehlungAnzahlen ?? '',
              erste_kontrolle_zaehlung_einheiten:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleZaehlungEinheiten ?? '',
              erste_kontrolle_zaehlung_methoden:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.ersteKontrolleZaehlungMethoden ?? '',
              letzte_kontrolle_id:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleId ?? '',
              letzte_kontrolle_jahr:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleJahr ?? '',
              letzte_kontrolle_datum:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleDatum ?? '',
              letzte_kontrolle_typ:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleTyp ?? '',
              letzte_kontrolle_bearbeiter:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleBearbeiter ?? '',
              letzte_kontrolle_ueberlebensrate:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleUeberlebensrate ?? '',
              letzte_kontrolle_vitalitaet:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleVitalitaet ?? '',
              letzte_kontrolle_entwicklung:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleEntwicklung ?? '',
              letzte_kontrolle_ursachen:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleUrsachen ?? '',
              letzte_kontrolle_erfolgsbeurteilung:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleErfolgsbeurteilung ?? '',
              letzte_kontrolle_umsetzung_aendern:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleUmsetzungAendern ?? '',
              letzte_kontrolle_kontrolle_aendern:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleKontrolleAendern ?? '',
              letzte_kontrolle_bemerkungen:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleBemerkungen ?? '',
              letzte_kontrolle_lr_delarze:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleLrDelarze ?? '',
              letzte_kontrolle_lr_umgebung_delarze:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleLrUmgebungDelarze ?? '',
              letzte_kontrolle_vegetationstyp:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleVegetationstyp ?? '',
              letzte_kontrolle_konkurrenz:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleKonkurrenz ?? '',
              letzte_kontrolle_moosschicht:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleMoosschicht ?? '',
              letzte_kontrolle_krautschicht:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleKrautschicht ?? '',
              letzte_kontrolle_strauchschicht:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleStrauchschicht ?? '',
              letzte_kontrolle_baumschicht:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleBaumschicht ?? '',
              letzte_kontrolle_idealbiotop_uebereinstimmung:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleIdealbiotopUebereinstimmung ??
                '',
              letzte_kontrolle_handlungsbedarf:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleHandlungsbedarf ?? '',
              letzte_kontrolle_flaeche_ueberprueft:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleFlaecheUeberprueft ?? '',
              letzte_kontrolle_flaeche:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleFlaeche ?? '',
              letzte_kontrolle_plan_vorhanden:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrollePlanVorhanden ?? '',
              letzte_kontrolle_deckung_vegetation:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleDeckungVegetation ?? '',
              letzte_kontrolle_deckung_nackter_boden:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleDeckungNackterBoden ?? '',
              letzte_kontrolle_deckung_ap_art:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleDeckungApArt ?? '',
              letzte_kontrolle_jungpflanzen_vorhanden:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleJungpflanzenVorhanden ?? '',
              letzte_kontrolle_vegetationshoehe_maximum:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleVegetationshoeheMaximum ?? '',
              letzte_kontrolle_vegetationshoehe_mittel:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleVegetationshoeheMittel ?? '',
              letzte_kontrolle_gefaehrdung:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleGefaehrdung ?? '',
              letzte_kontrolle_changed:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleChanged ?? '',
              letzte_kontrolle_changed_by:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleChangedBy ?? '',
              letzte_kontrolle_apber_nicht_relevant:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleApberNichtRelevant ?? '',
              letzte_kontrolle_apber_nicht_relevant_grund:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleApberNichtRelevantGrund ?? '',
              letzte_kontrolle_ekf_bemerkungen:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleEkfBemerkungen ?? '',
              letzte_kontrolle_zaehlung_anzahlen:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleZaehlungAnzahlen ?? '',
              letzte_kontrolle_zaehlung_einheiten:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleZaehlungEinheiten ?? '',
              letzte_kontrolle_zaehlung_methoden:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.letzteKontrolleZaehlungMethoden ?? '',
              tpopber_anz:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.tpopberAnz ?? '',
              tpopber_id:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.tpopberId ?? '',
              tpopber_jahr:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.tpopberJahr ?? '',
              tpopber_entwicklung:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.tpopberEntwicklung ?? '',
              tpopber_bemerkungen:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.tpopberBemerkungen ?? '',
              tpopber_created_at:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.tpopberCreatedAt ?? '',
              tpopber_updated_at:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.tpopberUpdatedAt ?? '',
              tpopber_changed_by:
                n?.vTpopErsteUndLetzteKontrolleUndLetzterTpopbersById
                  ?.nodes?.[0]?.tpopberChangedBy ?? '',
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
          query={queryAeTaxonomies}
          filter={aeTaxonomiesfilter}
          queryNodesName="allAeTaxonomies"
          error={ewmMessage}
        />
      </AutocompleteContainer>
      <DownloadCardButton
        color="inherit"
        onClick={async () => {
          const notif = enqueNotification({
            message: `Export "TeilpopulationenTPopUndMassnBerichte" wird vorbereitet...`,
            options: {
              variant: 'info',
              persist: true,
            },
          })
          let result
          try {
            result = await client.query({
              query: await import('./allVTpopPopberundmassnbers').then(
                (m) => m.default,
              ),
            })
          } catch (error) {
            enqueNotification({
              message: error.message,
              options: { variant: 'error' },
            })
          }
          const rows = result.data?.allVTpopPopberundmassnbers?.nodes ?? []
          removeNotification(notif)
          closeSnackbar(notif)
          if (rows.length === 0) {
            return enqueNotification({
              message: 'Die Abfrage retournierte 0 Datensätze',
              options: {
                variant: 'warning',
              },
            })
          }
          exportModule({
            data: rows,
            fileName: 'TeilpopulationenTPopUndMassnBerichte',
            idKey: 'tpop_id',
            xKey: 'tpop_wgs84lat',
            yKey: 'tpop_wgs84long',
            store,
          })
        }}
      >
        Teilpopulationen inklusive Teilpopulations- und Massnahmen-Berichten
      </DownloadCardButton>
      <DownloadCardButton
        color="inherit"
        onClick={async () => {
          const notif = enqueNotification({
            message: `Export "TeilpopulationenLetzteZaehlungen" wird vorbereitet...`,
            options: {
              variant: 'info',
              persist: true,
            },
          })
          let result
          try {
            result = await client.query({
              query: await import('./queryTpopLastCount').then(
                (m) => m.default,
              ),
            })
          } catch (error) {
            enqueNotification({
              message: error.message,
              options: {
                variant: 'error',
              },
            })
          }
          const rows = (result.data?.allTpops?.nodes ?? []).map((z) => ({
            artname: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.artname ?? '',
            ap_id: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.apId ?? '',
            pop_id: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.popId ?? '',
            pop_nr: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.popNr ?? '',
            pop_name: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.popName ?? '',
            pop_status: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.popStatus ?? '',
            tpop_id: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.tpopId ?? '',
            tpop_nr: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.tpopNr ?? '',
            tpop_gemeinde:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.tpopGemeinde ?? '',
            tpop_flurname:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.tpopFlurname ?? '',
            tpop_status:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.tpopStatus ?? '',
            jahr: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.jahr ?? '',
            pflanzenTotal:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.pflanzenTotal ?? '',
            pflanzen_ohne_jungpflanzen:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]
                ?.pflanzenOhneJungpflanzen ?? '',
            triebeTotal:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.triebeTotal ?? '',
            triebe_beweidung:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.triebeBeweidung ?? '',
            keimlinge: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.keimlinge ?? '',
            davonRosetten:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.davonRosetten ?? '',
            jungpflanzen:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.jungpflanzen ?? '',
            blaetter: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.blatter ?? '',
            davonBluehende_pflanzen:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.davonBluhendePflanzen ??
              '',
            davonBluehende_triebe:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.davonBluhendeTriebe ?? '',
            blueten: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.bluten ?? '',
            fertile_pflanzen:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.fertilePflanzen ?? '',
            fruchtende_triebe:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.fruchtendeTriebe ?? '',
            bluetenstaende:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.blutenstande ?? '',
            fruchtstaende:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.fruchtstande ?? '',
            gruppen: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.gruppen ?? '',
            deckung: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.deckung ?? '',
            pflanzen_5m2:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.pflanzen5M2 ?? '',
            triebe_in_30m2:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.triebeIn30M2 ?? '',
            triebe_50m2:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.triebe50M2 ?? '',
            triebe_maehflaeche:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.triebeMahflache ?? '',
            flaeche_m2: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.flacheM2 ?? '',
            pflanzstellen:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.pflanzstellen ?? '',
            stellen: z?.vTpopLastCountsByTpopId?.nodes?.[0]?.stellen ?? '',
            andere_zaehleinheit:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.andereZaehleinheit ?? '',
            art_ist_vorhanden:
              z?.vTpopLastCountsByTpopId?.nodes?.[0]?.artIstVorhanden ?? '',
          }))
          removeNotification(notif)
          closeSnackbar(notif)
          if (rows.length === 0) {
            return enqueNotification({
              message: 'Die Abfrage retournierte 0 Datensätze',
              options: {
                variant: 'warning',
              },
            })
          }
          exportModule({
            data: sortBy(rows, ['artname', 'pop_nr', 'tpop_nr', 'jahr']),
            fileName: 'TPopLetzteZaehlungen',
            idKey: 'pop_id',
            store,
          })
        }}
      >
        Letzte Zählungen
      </DownloadCardButton>
      <DownloadCardButton
        color="inherit"
        onClick={async () => {
          const notif = enqueNotification({
            message: `Export "TPopLetzteZaehlungenInklMassn" wird vorbereitet...`,
            options: {
              variant: 'info',
              persist: true,
            },
          })
          let result
          try {
            result = await client.query({
              // view: v_tpop_last_count_with_massn
              query: await import('./allVTpopLastCountWithMassns').then(
                (m) => m.default,
              ),
            })
          } catch (error) {
            enqueNotification({
              message: error.message,
              options: {
                variant: 'error',
              },
            })
          }
          const rows = result.data?.allVTpopLastCountWithMassns?.nodes ?? []
          removeNotification(notif)
          closeSnackbar(notif)
          if (rows.length === 0) {
            return enqueNotification({
              message: 'Die Abfrage retournierte 0 Datensätze',
              options: {
                variant: 'warning',
              },
            })
          }
          exportModule({
            data: rows,
            fileName: 'TPopLetzteZaehlungenInklMassn',
            idKey: 'pop_id',
            store,
          })
        }}
      >
        Letzte Zählungen inklusive noch nicht kontrollierter Anpflanzungen
      </DownloadCardButton>
    </StyledCardContent>
  )
}

export default observer(Teilpopulationen)
