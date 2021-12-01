import React, { useContext, useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Icon from '@mui/material/Icon'
import Button from '@mui/material/Button'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import styled from 'styled-components'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import { useSnackbar } from 'notistack'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'

const StyledCard = styled(Card)`
  margin: 10px 0;
  background-color: #fff8e1 !important;
`
const StyledCardActions = styled(CardActions)`
  justify-content: space-between;
  cursor: pointer;
  height: auto !important;
`
const CardActionIconButton = styled(IconButton)`
  transform: ${(props) => (props['data-expanded'] ? 'rotate(180deg)' : 'none')};
`
const CardActionTitle = styled.div`
  padding-left: 8px;
  font-weight: bold;
  word-break: break-word;
  user-select: none;
`
const StyledCardContent = styled(CardContent)`
  margin: -15px 0 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: stretch;
  align-content: stretch;
`
const DownloadCardButton = styled(Button)`
  flex-basis: 450px;
  text-transform: none !important;
  font-weight: 500;
  display: block;
  text-align: left;
  justify-content: flex-start !important;
  user-select: none;
`

const Populationen = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const {
    enqueNotification,
    removeNotification,
    dataFilterTableIsFiltered,
    popGqlFilter,
  } = store
  const [expanded, setExpanded] = useState(false)
  const { closeSnackbar } = useSnackbar()

  const popIsFiltered = dataFilterTableIsFiltered({
    treeName: 'tree',
    table: 'pop',
  })

  return (
    <StyledCard>
      <StyledCardActions disableSpacing onClick={() => setExpanded(!expanded)}>
        <CardActionTitle>Populationen</CardActionTitle>
        <CardActionIconButton
          data-expanded={expanded}
          aria-expanded={expanded}
          aria-label="öffnen"
          color="inherit"
        >
          <Icon title={expanded ? 'schliessen' : 'öffnen'}>
            <ExpandMoreIcon />
          </Icon>
        </CardActionIconButton>
      </StyledCardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <StyledCardContent>
          <DownloadCardButton
            color="inherit"
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "Populationen" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: gql`
                    query popForExportQuery($filter: PopFilter) {
                      allPops(
                        filter: $filter
                        orderBy: [AP_BY_AP_ID__LABEL_ASC, NR_ASC]
                      ) {
                        nodes {
                          apId
                          apByApId {
                            id
                            aeTaxonomyByArtId {
                              id
                              artname
                            }
                            apBearbstandWerteByBearbeitung {
                              id
                              text
                            }
                            startJahr
                            apUmsetzungWerteByUmsetzung {
                              id
                              text
                            }
                          }
                          id
                          nr
                          name
                          popStatusWerteByStatus {
                            id
                            text
                          }
                          bekanntSeit
                          statusUnklar
                          statusUnklarBegruendung
                          x: lv95X
                          y: lv95Y
                          changed
                          changedBy
                        }
                      }
                    }
                  `,
                  variables: {
                    filter: popGqlFilter,
                  },
                })
              } catch (error) {
                enqueNotification({
                  message: error.message,
                  options: {
                    variant: 'error',
                  },
                })
              }
              const rows = (result?.data?.allPops?.nodes ?? []).map((n) => ({
                apId: n?.apByApId?.id ?? null,
                apArtname: n?.apByApId?.aeTaxonomyByArtId?.artname ?? null,
                apBearbeitung:
                  n?.apByApId?.apBearbstandWerteByBearbeitung?.text ?? null,
                apStartJahr: n?.apByApId?.startJahr ?? null,
                apUmsetzung:
                  n?.apByApId?.apUmsetzungWerteByUmsetzung?.text ?? null,
                id: n.id,
                nr: n.nr,
                name: n.name,
                status: n?.popStatusWerteByStatus?.text ?? null,
                bekanntSeit: n.bekanntSeit,
                statusUnklar: n.statusUnklar,
                statusUnklarBegruendung: n.statusUnklarBegruendung,
                x: n.x,
                y: n.y,
                changed: n.changed,
                changedBy: n.changedBy,
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
                data: rows,
                fileName: 'Populationen',
                store,
              })
            }}
          >
            {popIsFiltered ? 'Populationen (gefiltert)' : 'Populationen'}
          </DownloadCardButton>
          <DownloadCardButton
            color="inherit"
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "Populationen" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./queryPopKml').then((m) => m.default),
                })
              } catch (error) {
                enqueNotification({
                  message: error.message,
                  options: {
                    variant: 'error',
                  },
                })
              }
              const rows = (result?.data?.allPops?.nodes ?? []).map((z) => ({
                art: z?.vPopKmlsById?.nodes?.[0]?.art ?? '',
                label: z?.vPopKmlsById?.nodes?.[0]?.label ?? '',
                inhalte: z?.vPopKmlsById?.nodes?.[0]?.inhalte ?? '',
                id: z?.vPopKmlsById?.nodes?.[0]?.id ?? '',
                wgs84Lat: z?.vPopKmlsById?.nodes?.[0]?.wgs84Lat ?? '',
                wgs84Long: z?.vPopKmlsById?.nodes?.[0]?.wgs84Long ?? '',
                url: z?.vPopKmlsById?.nodes?.[0]?.url ?? '',
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
                fileName: 'Populationen',
                store,
                kml: true,
              })
            }}
          >
            <div>Populationen für Google Earth (beschriftet mit PopNr)</div>
          </DownloadCardButton>
          <DownloadCardButton
            color="inherit"
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "PopulationenNachNamen" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./queryPopKmlNamen').then(
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
              const rows = (result?.data?.allPops?.nodes ?? []).map((z) => ({
                art: z?.vPopKmlnamenById?.nodes?.[0]?.art ?? '',
                label: z?.vPopKmlnamenById?.nodes?.[0]?.label ?? '',
                inhalte: z?.vPopKmlnamenById?.nodes?.[0]?.inhalte ?? '',
                id: z?.vPopKmlnamenById?.nodes?.[0]?.id ?? '',
                wgs84Lat: z?.vPopKmlnamenById?.nodes?.[0]?.wgs84Lat ?? '',
                wgs84Long: z?.vPopKmlnamenById?.nodes?.[0]?.wgs84Long ?? '',
                url: z?.vPopKmlnamenById?.nodes?.[0]?.url ?? '',
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
                fileName: 'PopulationenNachNamen',
                store,
                kml: true,
              })
            }}
          >
            <div>
              Populationen für Google Earth (beschriftet mit Artname, PopNr)
            </div>
          </DownloadCardButton>
          <DownloadCardButton
            color="inherit"
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "PopulationenVonApArtenOhneStatus" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./queryPopVonApOhneStatus').then(
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
              const rows = (result?.data?.allPops?.nodes ?? []).map((z) => ({
                ap_id: z?.vPopVonapohnestatusesById?.nodes?.[0]?.apId ?? '',
                artname:
                  z?.vPopVonapohnestatusesById?.nodes?.[0]?.artname ?? '',
                ap_bearbeitung:
                  z?.vPopVonapohnestatusesById?.nodes?.[0]?.apBearbeitung ?? '',
                id: z?.vPopVonapohnestatusesById?.nodes?.[0]?.id ?? '',
                nr: z?.vPopVonapohnestatusesById?.nodes?.[0]?.nr ?? '',
                name: z?.vPopVonapohnestatusesById?.nodes?.[0]?.name ?? '',
                status: z?.vPopVonapohnestatusesById?.nodes?.[0]?.status ?? '',
                lv95X: z?.vPopVonapohnestatusesById?.nodes?.[0]?.x ?? '',
                lv95Y: z?.vPopVonapohnestatusesById?.nodes?.[0]?.y ?? '',
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
                data: sortBy(rows, ['artname', 'nr']),
                fileName: 'PopulationenVonApArtenOhneStatus',
                store,
              })
            }}
          >
            Populationen von AP-Arten ohne Status
          </DownloadCardButton>
          <DownloadCardButton
            color="inherit"
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "PopulationenOhneKoordinaten" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./queryPopOhneKoords').then(
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
              const rows = (result?.data?.allPops?.nodes ?? []).map((z) => ({
                ap_id: z?.vPopOhnekoordsById?.nodes?.[0]?.apId ?? '',
                artname: z?.vPopOhnekoordsById?.nodes?.[0]?.artname ?? '',
                ap_bearbeitung:
                  z?.vPopOhnekoordsById?.nodes?.[0]?.apBearbeitung ?? '',
                ap_start_jahr:
                  z?.vPopOhnekoordsById?.nodes?.[0]?.apStartJahr ?? '',
                ap_umsetzung:
                  z?.vPopOhnekoordsById?.nodes?.[0]?.apUmsetzung ?? '',
                id: z?.vPopOhnekoordsById?.nodes?.[0]?.id ?? '',
                nr: z?.vPopOhnekoordsById?.nodes?.[0]?.nr ?? '',
                name: z?.vPopOhnekoordsById?.nodes?.[0]?.name ?? '',
                status: z?.vPopOhnekoordsById?.nodes?.[0]?.status ?? '',
                bekannt_seit:
                  z?.vPopOhnekoordsById?.nodes?.[0]?.bekanntSeit ?? '',
                status_unklar:
                  z?.vPopOhnekoordsById?.nodes?.[0]?.statusUnklar ?? '',
                status_unklar_begruendung:
                  z?.vPopOhnekoordsById?.nodes?.[0]?.statusUnklarBegruendung ??
                  '',
                lv95X: z?.vPopOhnekoordsById?.nodes?.[0]?.x ?? '',
                lv95Y: z?.vPopOhnekoordsById?.nodes?.[0]?.y ?? '',
                changed: z?.vPopOhnekoordsById?.nodes?.[0]?.changed ?? '',
                changed_by: z?.vPopOhnekoordsById?.nodes?.[0]?.changedBy ?? '',
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
                data: sortBy(rows, ['artname', 'nr']),
                fileName: 'PopulationenOhneKoordinaten',
                store,
              })
            }}
          >
            Populationen ohne Koordinaten
          </DownloadCardButton>
          <DownloadCardButton
            color="inherit"
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "PopulationenAnzMassnProMassnber" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./queryPopmassnberAnzMassns').then(
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
              const rows = (result?.data?.allPopmassnbers?.nodes ?? []).map(
                (n) => ({
                  ap_id: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.apId ?? '',
                  artname:
                    n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.artname ?? '',
                  ap_bearbeitung:
                    n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.apBearbeitung ??
                    '',
                  ap_start_jahr:
                    n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.apStartJahr ?? '',
                  ap_umsetzung:
                    n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.apUmsetzung ?? '',
                  pop_id: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popId ?? '',
                  pop_nr: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popNr ?? '',
                  pop_name:
                    n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popName ?? '',
                  pop_status:
                    n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popStatus ?? '',
                  pop_bekannt_seit:
                    n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popBekanntSeit ??
                    '',
                  pop_status_unklar:
                    n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popStatusUnklar ??
                    '',
                  pop_status_unklar_begruendung:
                    n?.vPopmassnberAnzmassnsById?.nodes?.[0]
                      ?.popStatusUnklarBegruendung ?? '',
                  pop_x: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popX ?? '',
                  pop_y: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popY ?? '',
                  pop_changed:
                    n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popChanged ?? '',
                  pop_changed_by:
                    n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popChangedBy ??
                    '',
                  id: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.id ?? '',
                  jahr: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.jahr ?? '',
                  entwicklung:
                    n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.entwicklung ?? '',
                  bemerkungen:
                    n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.bemerkungen ?? '',
                  changed:
                    n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.changed ?? '',
                  changed_by:
                    n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.changedBy ?? '',
                  anzahl_massnahmen:
                    n?.vPopmassnberAnzmassnsById?.nodes?.[0]
                      ?.anzahlMassnahmen ?? '',
                }),
              )
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
              console.log('Populationen export', { rows, data: result?.data })
              exportModule({
                data: sortBy(rows, ['artname', 'pop_nr', 'jahr']),
                fileName: 'PopulationenAnzMassnProMassnber',
                idKey: 'pop_id',
                xKey: 'pop_wgs84lat',
                yKey: 'pop_wgs84long',
                store,
              })
            }}
          >
            Populationen mit Massnahmen-Berichten: Anzahl Massnahmen im
            Berichtsjahr
          </DownloadCardButton>
          <DownloadCardButton
            color="inherit"
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "PopulationenAnzahlMassnahmen" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./queryPopAnzMassns').then(
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
              const rows = (result?.data?.allPops?.nodes ?? []).map((z) => ({
                ap_id: z?.vPopAnzmassnsById?.nodes?.[0]?.apId ?? '',
                artname: z?.vPopAnzmassnsById?.nodes?.[0]?.artname ?? '',
                ap_bearbeitung:
                  z?.vPopAnzmassnsById?.nodes?.[0]?.apBearbeitung ?? '',
                ap_start_jahr:
                  z?.vPopAnzmassnsById?.nodes?.[0]?.apStartJahr ?? '',
                ap_umsetzung:
                  z?.vPopAnzmassnsById?.nodes?.[0]?.apUmsetzung ?? '',
                id: z?.vPopAnzmassnsById?.nodes?.[0]?.id ?? '',
                nr: z?.vPopAnzmassnsById?.nodes?.[0]?.nr ?? '',
                name: z?.vPopAnzmassnsById?.nodes?.[0]?.name ?? '',
                status: z?.vPopAnzmassnsById?.nodes?.[0]?.status ?? '',
                bekannt_seit:
                  z?.vPopAnzmassnsById?.nodes?.[0]?.bekanntSeit ?? '',
                status_unklar:
                  z?.vPopAnzmassnsById?.nodes?.[0]?.statusUnklar ?? '',
                status_unklar_begruendung:
                  z?.vPopAnzmassnsById?.nodes?.[0]?.statusUnklarBegruendung ??
                  '',
                x: z?.vPopAnzmassnsById?.nodes?.[0]?.x ?? '',
                y: z?.vPopAnzmassnsById?.nodes?.[0]?.y ?? '',
                anzahl_massnahmen:
                  z?.vPopAnzmassnsById?.nodes?.[0]?.anzahlMassnahmen ?? '',
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
                data: sortBy(rows, ['artname', 'nr']),
                fileName: 'PopulationenAnzahlMassnahmen',
                store,
              })
            }}
          >
            Anzahl Massnahmen pro Population
          </DownloadCardButton>
          <DownloadCardButton
            color="inherit"
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "PopulationenAnzahlKontrollen" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./queryPopAnzKontrs').then(
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
              const rows = (result?.data?.allPops?.nodes ?? []).map((z) => ({
                ap_id: z?.vPopAnzkontrsById?.nodes?.[0]?.apId ?? '',
                artname: z?.vPopAnzkontrsById?.nodes?.[0]?.artname ?? '',
                ap_bearbeitung:
                  z?.vPopAnzkontrsById?.nodes?.[0]?.apBearbeitung ?? '',
                ap_start_jahr:
                  z?.vPopAnzkontrsById?.nodes?.[0]?.apStartJahr ?? '',
                ap_umsetzung:
                  z?.vPopAnzkontrsById?.nodes?.[0]?.apUmsetzung ?? '',
                id: z?.vPopAnzkontrsById?.nodes?.[0]?.id ?? '',
                nr: z?.vPopAnzkontrsById?.nodes?.[0]?.nr ?? '',
                name: z?.vPopAnzkontrsById?.nodes?.[0]?.name ?? '',
                status: z?.vPopAnzkontrsById?.nodes?.[0]?.status ?? '',
                bekannt_seit:
                  z?.vPopAnzkontrsById?.nodes?.[0]?.bekanntSeit ?? '',
                status_unklar:
                  z?.vPopAnzkontrsById?.nodes?.[0]?.statusUnklar ?? '',
                status_unklar_begruendung:
                  z?.vPopAnzkontrsById?.nodes?.[0]?.statusUnklarBegruendung ??
                  '',
                x: z?.vPopAnzkontrsById?.nodes?.[0]?.x ?? '',
                y: z?.vPopAnzkontrsById?.nodes?.[0]?.y ?? '',
                anzahl_kontrollen:
                  z?.vPopAnzkontrsById?.nodes?.[0]?.anzahlKontrollen ?? '',
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
                data: sortBy(rows, ['artname', 'nr']),
                fileName: 'PopulationenAnzahlKontrollen',
                store,
              })
            }}
          >
            Anzahl Kontrollen pro Population
          </DownloadCardButton>
          <DownloadCardButton
            color="inherit"
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "PopulationenPopUndMassnBerichte" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./queryPopPopberUndMassnber').then(
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
              // need to flatmap because view delivers multiple rows per pop
              const rows = (result?.data?.allPops?.nodes ?? []).flatMap((z0) =>
                (z0?.vPopPopberundmassnbersByPopId?.nodes ?? []).map((z) => ({
                  ap_id: z.apId,
                  artname: z.artname,
                  ap_bearbeitung: z.apBearbeitung,
                  ap_start_jahr: z.apStartJahr,
                  ap_umsetzung: z.apUmsetzung,
                  pop_id: z.popId,
                  pop_nr: z.popNr,
                  pop_name: z.popName,
                  pop_status: z.popStatus,
                  pop_bekannt_seit: z.popBekanntSeit,
                  pop_status_unklar: z.popStatusUnklar,
                  pop_status_unklar_begruendung: z.popStatusUnklarBegruendung,
                  pop_x: z.popX,
                  pop_y: z.popY,
                  pop_changed: z.popChanged,
                  pop_changed_by: z.popChangedBy,
                  jahr: z.jahr,
                  popber_id: z.popberId,
                  popber_jahr: z.popberJahr,
                  popber_entwicklung: z.popberEntwicklung,
                  popber_bemerkungen: z.popberBemerkungen,
                  popber_changed: z.popberChanged,
                  popber_changed_by: z.popberChangedBy,
                  popmassnber_id: z.popmassnberId,
                  popmassnber_jahr: z.popmassnberJahr,
                  popmassnber_entwicklung: z.popmassnberEntwicklung,
                  popmassnber_bemerkungen: z.popmassnberBemerkungen,
                  popmassnber_changed: z.popmassnberChanged,
                  popmassnber_changed_by: z.popmassnberChangedBy,
                })),
              )
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
                data: sortBy(rows, ['artname', 'pop_nr', 'jahr']),
                fileName: 'PopulationenPopUndMassnBerichte',
                idKey: 'pop_id',
                xKey: 'pop_wgs84lat',
                yKey: 'pop_wgs84long',
                store,
              })
            }}
          >
            Populationen inkl. Populations- und Massnahmen-Berichte
          </DownloadCardButton>
          <DownloadCardButton
            color="inherit"
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "PopulationenMitLetzemPopBericht" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./queryPopMitLetzterPopbers').then(
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
              const rows = (result?.data?.allPops?.nodes ?? []).map((z) => ({
                ap_id: z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.apId ?? '',
                artname:
                  z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.artname ?? '',
                ap_bearbeitung:
                  z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.apBearbeitung ??
                  '',
                ap_start_jahr:
                  z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.apStartJahr ??
                  '',
                ap_umsetzung:
                  z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.apUmsetzung ??
                  '',
                pop_id:
                  z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popId ?? '',
                pop_nr:
                  z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popNr ?? '',
                pop_name:
                  z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popName ?? '',
                pop_status:
                  z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popStatus ?? '',
                pop_bekannt_seit:
                  z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popBekanntSeit ??
                  '',
                pop_status_unklar:
                  z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]
                    ?.popStatusUnklar ?? '',
                pop_status_unklar_begruendung:
                  z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]
                    ?.popStatusUnklarBegruendung ?? '',
                pop_x: z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popX ?? '',
                pop_y: z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popY ?? '',
                pop_changed:
                  z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popChanged ?? '',
                pop_changed_by:
                  z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popChangedBy ??
                  '',
                popber_id:
                  z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popberId ?? '',
                popber_jahr:
                  z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popberJahr ?? '',
                popber_entwicklung:
                  z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]
                    ?.popberEntwicklung ?? '',
                popber_bemerkungen:
                  z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]
                    ?.popberBemerkungen ?? '',
                popber_changed:
                  z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popberChanged ??
                  '',
                popber_changed_by:
                  z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]
                    ?.popberChangedBy ?? '',
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
                data: sortBy(rows, ['artname', 'pop_nr']),
                fileName: 'PopulationenMitLetzemPopBericht',
                idKey: 'pop_id',
                xKey: 'pop_wgs84lat',
                yKey: 'pop_wgs84long',
                store,
              })
            }}
          >
            Populationen mit dem letzten Populations-Bericht
          </DownloadCardButton>
          <DownloadCardButton
            color="inherit"
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "PopulationenMitLetztemMassnBericht" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./queryPopMitLetzterPopmassnbers').then(
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
              const rows = (result?.data?.allPops?.nodes ?? []).map((z) => ({
                ap_id:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.apId ?? '',
                artname:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.artname ??
                  '',
                ap_bearbeitung:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]
                    ?.apBearbeitung ?? '',
                ap_start_jahr:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]
                    ?.apStartJahr ?? '',
                ap_umsetzung:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]
                    ?.apUmsetzung ?? '',
                pop_id:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.popId ?? '',
                pop_nr:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.popNr ?? '',
                pop_name:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.popName ??
                  '',
                pop_status:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.popStatus ??
                  '',
                pop_bekannt_seit:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]
                    ?.popBekanntSeit ?? '',
                pop_status_unklar:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]
                    ?.popStatusUnklar ?? '',
                pop_status_unklar_begruendung:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]
                    ?.popStatusUnklarBegruendung ?? '',
                pop_x:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.popX ?? '',
                pop_y:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]?.popY ?? '',
                pop_changed:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]
                    ?.popChanged ?? '',
                pop_changed_by:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]
                    ?.popChangedBy ?? '',
                popmassnber_id:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]
                    ?.popmassnberId ?? '',
                popmassnber_jahr:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]
                    ?.popmassnberJahr ?? '',
                popmassnber_entwicklung:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]
                    ?.popmassnberEntwicklung ?? '',
                popmassnber_bemerkungen:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]
                    ?.popmassnberBemerkungen ?? '',
                popmassnber_changed:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]
                    ?.popmassnberChanged ?? '',
                popmassnber_changed_by:
                  z?.vPopMitLetzterPopmassnbersByPopId?.nodes?.[0]
                    ?.popmassnberChangedBy ?? '',
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
                data: sortBy(rows, ['artname', 'pop_nr']),
                fileName: 'allVPopMitLetzterPopmassnbers',
                idKey: 'pop_id',
                xKey: 'pop_wgs84lat',
                yKey: 'pop_wgs84long',
                store,
              })
            }}
          >
            Populationen mit dem letzten Massnahmen-Bericht
          </DownloadCardButton>
          <DownloadCardButton
            color="inherit"
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "PopulationenLetzteZaehlungen" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./queryPopLastCounts').then(
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
              const rows = (result?.data?.allPops?.nodes ?? []).map((z) => ({
                artname: z?.vPopLastCountsByPopId?.nodes?.[0]?.artname ?? '',
                ap_id: z?.vPopLastCountsByPopId?.nodes?.[0]?.apId ?? '',
                pop_id: z?.vPopLastCountsByPopId?.nodes?.[0]?.popId ?? '',
                pop_nr: z?.vPopLastCountsByPopId?.nodes?.[0]?.popNr ?? '',
                pop_name: z?.vPopLastCountsByPopId?.nodes?.[0]?.popName ?? '',
                pop_status:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.popStatus ?? '',
                jahre: z?.vPopLastCountsByPopId?.nodes?.[0]?.jahre ?? '',
                pflanzenTotal:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.pflanzenTotal ?? '',
                pflanzen_ohne_jungpflanzen:
                  z?.vPopLastCountsByPopId?.nodes?.[0]
                    ?.pflanzenOhneJungpflanzen ?? '',
                triebeTotal:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.triebeTotal ?? '',
                triebe_beweidung:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.triebeBeweidung ?? '',
                keimlinge:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.keimlinge ?? '',
                davonRosetten:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.davonRosetten ?? '',
                jungpflanzen:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.jungpflanzen ?? '',
                blaetter: z?.vPopLastCountsByPopId?.nodes?.[0]?.blatter ?? '',
                davonBluehende_pflanzen:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.davonBluhendePflanzen ??
                  '',
                davonBluehende_triebe:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.davonBluhendeTriebe ??
                  '',
                blueten: z?.vPopLastCountsByPopId?.nodes?.[0]?.bluten ?? '',
                fertile_pflanzen:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.fertilePflanzen ?? '',
                fruchtende_triebe:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.fruchtendeTriebe ?? '',
                bluetenstaende:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.blutenstande ?? '',
                fruchtstaende:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.fruchtstande ?? '',
                gruppen: z?.vPopLastCountsByPopId?.nodes?.[0]?.gruppen ?? '',
                deckung: z?.vPopLastCountsByPopId?.nodes?.[0]?.deckung ?? '',
                pflanzen_5m2:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.pflanzen5M2 ?? '',
                triebe_in_30m2:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.triebeIn30M2 ?? '',
                triebe_50m2:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.triebe50M2 ?? '',
                triebe_maehflaeche:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.triebeMahflache ?? '',
                flaeche_m2:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.flacheM2 ?? '',
                pflanzstellen:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.pflanzstellen ?? '',
                stellen: z?.vPopLastCountsByPopId?.nodes?.[0]?.stellen ?? '',
                andere_zaehleinheit:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.andereZaehleinheit ??
                  '',
                art_ist_vorhanden:
                  z?.vPopLastCountsByPopId?.nodes?.[0]?.artIstVorhanden ?? '',
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
                data: sortBy(rows, ['artname', 'pop_nr']),
                fileName: 'PopLetzteZaehlungen',
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
                message: `Export "PopLetzteZaehlungenInklMassn" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./queryPopLastCountWithMassns').then(
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
              const rows = (result?.data?.allPops?.nodes ?? []).map((z) => ({
                artname:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.artname ?? '',
                ap_id:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.apId ?? '',
                pop_id:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.popId ?? '',
                pop_nr:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.popNr ?? '',
                pop_name:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.popName ?? '',
                pop_status:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.popStatus ??
                  '',
                jahre:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.jahre ?? '',
                pflanzenTotal:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                    ?.pflanzenTotal ?? '',
                pflanzen_ohne_jungpflanzen:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                    ?.pflanzenOhneJungpflanzen ?? '',
                triebeTotal:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.triebeTotal ??
                  '',
                triebe_beweidung:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                    ?.triebeBeweidung ?? '',
                keimlinge:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.keimlinge ??
                  '',
                davonRosetten:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                    ?.davonRosetten ?? '',
                jungpflanzen:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.jungpflanzen ??
                  '',
                blaetter:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.blatter ?? '',
                davonBluehende_pflanzen:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                    ?.davonBluhendePflanzen ?? '',
                davonBluehende_triebe:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                    ?.davonBluhendeTriebe ?? '',
                blueten:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.bluten ?? '',
                fertile_pflanzen:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                    ?.fertilePflanzen ?? '',
                fruchtende_triebe:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                    ?.fruchtendeTriebe ?? '',
                bluetenstaende:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.blutenstande ??
                  '',
                fruchtstaende:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.fruchtstande ??
                  '',
                gruppen:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.gruppen ?? '',
                deckung:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.deckung ?? '',
                pflanzen_5m2:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.pflanzen5M2 ??
                  '',
                triebe_in_30m2:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.triebeIn30M2 ??
                  '',
                triebe_50m2:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.triebe50M2 ??
                  '',
                triebe_maehflaeche:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                    ?.triebeMahflache ?? '',
                flaeche_m2:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.flacheM2 ?? '',
                pflanzstellen:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                    ?.pflanzstellen ?? '',
                stellen:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]?.stellen ?? '',
                andere_zaehleinheit:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                    ?.andereZaehleinheit ?? '',
                art_ist_vorhanden:
                  z?.vPopLastCountWithMassnsByPopId?.nodes?.[0]
                    ?.artIstVorhanden ?? '',
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
                data: sortBy(rows, ['artname', 'pop_nr']),
                fileName: 'PopLetzteZaehlungenInklMassn',
                idKey: 'pop_id',
                store,
              })
            }}
          >
            Letzte Zählungen inklusive noch nicht kontrollierter Anpflanzungen
          </DownloadCardButton>
        </StyledCardContent>
      </Collapse>
    </StyledCard>
  )
}

export default observer(Populationen)
