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
import AnzMassnahmen from './AnzMassnahmen'
import TPopOhneApberRelevant from './TPopOhneApberRelevant'
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
      <TPopOhneApberRelevant />
      <AnzMassnahmen />
      <Wollmilchsau />
      <WollmilchsauSingle />
      <TPopInklBerichte />
      <LetzteZaehlungen />
      <LetzteZaehlungenInklAnpflanzungen />
    </StyledCardContent>
  )
}

export default observer(Teilpopulationen)
