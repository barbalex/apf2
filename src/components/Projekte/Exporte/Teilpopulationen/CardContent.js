import React, { useContext } from 'react'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client'
import { useSnackbar } from 'notistack'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import TPop from './TPop'
import Wollmilchsau from './Wollmilchsau'
import WollmilchsauSingle from './WollmilchsauSingle'
import LetzteZaehlungen from './LetzteZaehlungen'
import LetzteZaehlungenInklAnpflanzungen from './LetzteZaehlungenInklAnpflanzungen'
import TPopInklBerichte from './TPopInklBerichte'
import { StyledCardContent, DownloadCardButton } from '../index'

const Teilpopulationen = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification, removeNotification } = store

  const { closeSnackbar } = useSnackbar()

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
      <WollmilchsauSingle />
      <TPopInklBerichte />
      <LetzteZaehlungen />
      <LetzteZaehlungenInklAnpflanzungen />
    </StyledCardContent>
  )
}

export default observer(Teilpopulationen)
