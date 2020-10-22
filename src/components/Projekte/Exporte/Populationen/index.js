import React, { useContext, useState } from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import styled from 'styled-components'
import get from 'lodash/get'
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
  > span:first-of-type {
    text-transform: none !important;
    font-weight: 500;
    display: block;
    text-align: left;
    justify-content: flex-start !important;
    user-select: none;
  }
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
        >
          <Icon title={expanded ? 'schliessen' : 'öffnen'}>
            <ExpandMoreIcon />
          </Icon>
        </CardActionIconButton>
      </StyledCardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <StyledCardContent>
          <DownloadCardButton
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
              const rows = get(result?.data, 'allPops.nodes', []).map((n) => ({
                apId: get(n, 'apByApId.id') || null,
                apArtname: get(n, 'apByApId.aeTaxonomyByArtId.artname') || null,
                apBearbeitung:
                  get(n, 'apByApId.apBearbstandWerteByBearbeitung.text') ||
                  null,
                apStartJahr: get(n, 'apByApId.startJahr') || null,
                apUmsetzung:
                  get(n, 'apByApId.apUmsetzungWerteByUmsetzung.text') || null,
                id: n.id,
                nr: n.nr,
                name: n.name,
                status: get(n, 'popStatusWerteByStatus.text') || null,
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
              const rows = get(result?.data, 'allPops.nodes', []).map((z) => ({
                art: get(z, 'vPopKmlsById.nodes[0].art', ''),
                label: get(z, 'vPopKmlsById.nodes[0].label', ''),
                inhalte: get(z, 'vPopKmlsById.nodes[0].inhalte', ''),
                id: get(z, 'vPopKmlsById.nodes[0].id', ''),
                wgs84Lat: get(z, 'vPopKmlsById.nodes[0].wgs84Lat', ''),
                wgs84Long: get(z, 'vPopKmlsById.nodes[0].wgs84Long', ''),
                url: get(z, 'vPopKmlsById.nodes[0].url', ''),
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
              const rows = get(result?.data, 'allPops.nodes', []).map((z) => ({
                art: get(z, 'vPopKmlnamenById.nodes[0].art', ''),
                label: get(z, 'vPopKmlnamenById.nodes[0].label', ''),
                inhalte: get(z, 'vPopKmlnamenById.nodes[0].inhalte', ''),
                id: get(z, 'vPopKmlnamenById.nodes[0].id', ''),
                wgs84Lat: get(z, 'vPopKmlnamenById.nodes[0].wgs84Lat', ''),
                wgs84Long: get(z, 'vPopKmlnamenById.nodes[0].wgs84Long', ''),
                url: get(z, 'vPopKmlnamenById.nodes[0].url', ''),
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
              const rows = get(result?.data, 'allPops.nodes', []).map((z) => ({
                ap_id: get(z, 'vPopVonapohnestatusesById.nodes[0].apId', ''),
                artname: get(
                  z,
                  'vPopVonapohnestatusesById.nodes[0].artname',
                  '',
                ),
                ap_bearbeitung: get(
                  z,
                  'vPopVonapohnestatusesById.nodes[0].apBearbeitung',
                  '',
                ),
                id: get(z, 'vPopVonapohnestatusesById.nodes[0].id', ''),
                nr: get(z, 'vPopVonapohnestatusesById.nodes[0].nr', ''),
                name: get(z, 'vPopVonapohnestatusesById.nodes[0].name', ''),
                status: get(z, 'vPopVonapohnestatusesById.nodes[0].status', ''),
                lv95X: get(z, 'vPopVonapohnestatusesById.nodes[0].x', ''),
                lv95Y: get(z, 'vPopVonapohnestatusesById.nodes[0].y', ''),
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
              const rows = get(result?.data, 'allPops.nodes', []).map((z) => ({
                ap_id: get(z, 'vPopOhnekoordsById.nodes[0].apId', ''),
                artname: get(z, 'vPopOhnekoordsById.nodes[0].artname', ''),
                ap_bearbeitung: get(
                  z,
                  'vPopOhnekoordsById.nodes[0].apBearbeitung',
                  '',
                ),
                ap_start_jahr: get(
                  z,
                  'vPopOhnekoordsById.nodes[0].apStartJahr',
                  '',
                ),
                ap_umsetzung: get(
                  z,
                  'vPopOhnekoordsById.nodes[0].apUmsetzung',
                  '',
                ),
                id: get(z, 'vPopOhnekoordsById.nodes[0].id', ''),
                nr: get(z, 'vPopOhnekoordsById.nodes[0].nr', ''),
                name: get(z, 'vPopOhnekoordsById.nodes[0].name', ''),
                status: get(z, 'vPopOhnekoordsById.nodes[0].status', ''),
                bekannt_seit: get(
                  z,
                  'vPopOhnekoordsById.nodes[0].bekanntSeit',
                  '',
                ),
                status_unklar: get(
                  z,
                  'vPopOhnekoordsById.nodes[0].statusUnklar',
                  '',
                ),
                status_unklar_begruendung: get(
                  z,
                  'vPopOhnekoordsById.nodes[0].statusUnklarBegruendung',
                  '',
                ),
                lv95X: get(z, 'vPopOhnekoordsById.nodes[0].x', ''),
                lv95Y: get(z, 'vPopOhnekoordsById.nodes[0].y', ''),
                changed: get(z, 'vPopOhnekoordsById.nodes[0].changed', ''),
                changed_by: get(z, 'vPopOhnekoordsById.nodes[0].changedBy', ''),
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
              const rows = get(result?.data, 'allPopmassnbers.nodes', []).map(
                (n) => ({
                  ap_id: get(n, 'vPopmassnberAnzmassnsById.nodes[0]apId', ''),
                  artname: get(
                    n,
                    'vPopmassnberAnzmassnsById.nodes[0]artname',
                    '',
                  ),
                  ap_bearbeitung: get(
                    n,
                    'vPopmassnberAnzmassnsById.nodes[0]apBearbeitung',
                    '',
                  ),
                  ap_start_jahr: get(
                    n,
                    'vPopmassnberAnzmassnsById.nodes[0]apStartJahr',
                    '',
                  ),
                  ap_umsetzung: get(
                    n,
                    'vPopmassnberAnzmassnsById.nodes[0]apUmsetzung',
                    '',
                  ),
                  pop_id: get(n, 'vPopmassnberAnzmassnsById.nodes[0]popId', ''),
                  pop_nr: get(n, 'vPopmassnberAnzmassnsById.nodes[0]popNr', ''),
                  pop_name: get(
                    n,
                    'vPopmassnberAnzmassnsById.nodes[0]popName',
                    '',
                  ),
                  pop_status: get(
                    n,
                    'vPopmassnberAnzmassnsById.nodes[0]popStatus',
                    '',
                  ),
                  pop_bekannt_seit: get(
                    n,
                    'vPopmassnberAnzmassnsById.nodes[0]popBekanntSeit',
                    '',
                  ),
                  pop_status_unklar: get(
                    n,
                    'vPopmassnberAnzmassnsById.nodes[0]popStatusUnklar',
                    '',
                  ),
                  pop_status_unklar_begruendung: get(
                    n,
                    'vPopmassnberAnzmassnsById.nodes[0]popStatusUnklarBegruendung',
                    '',
                  ),
                  pop_x: get(n, 'vPopmassnberAnzmassnsById.nodes[0]popX', ''),
                  pop_y: get(n, 'vPopmassnberAnzmassnsById.nodes[0]popY', ''),
                  pop_changed: get(
                    n,
                    'vPopmassnberAnzmassnsById.nodes[0]popChanged',
                    '',
                  ),
                  pop_changed_by: get(
                    n,
                    'vPopmassnberAnzmassnsById.nodes[0]popChangedBy',
                    '',
                  ),
                  id: get(n, 'vPopmassnberAnzmassnsById.nodes[0]id', ''),
                  jahr: get(n, 'vPopmassnberAnzmassnsById.nodes[0]jahr', ''),
                  entwicklung: get(
                    n,
                    'vPopmassnberAnzmassnsById.nodes[0]entwicklung',
                    '',
                  ),
                  bemerkungen: get(
                    n,
                    'vPopmassnberAnzmassnsById.nodes[0]bemerkungen',
                    '',
                  ),
                  changed: get(
                    n,
                    'vPopmassnberAnzmassnsById.nodes[0]changed',
                    '',
                  ),
                  changed_by: get(
                    n,
                    'vPopmassnberAnzmassnsById.nodes[0]changedBy',
                    '',
                  ),
                  anzahl_massnahmen: get(
                    n,
                    'vPopmassnberAnzmassnsById.nodes[0]anzahlMassnahmen',
                    '',
                  ),
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
              const rows = get(result?.data, 'allPops.nodes', []).map((z) => ({
                ap_id: get(z, 'vPopAnzmassnsById.nodes[0].apId', ''),
                artname: get(z, 'vPopAnzmassnsById.nodes[0].artname', ''),
                ap_bearbeitung: get(
                  z,
                  'vPopAnzmassnsById.nodes[0].apBearbeitung',
                  '',
                ),
                ap_start_jahr: get(
                  z,
                  'vPopAnzmassnsById.nodes[0].apStartJahr',
                  '',
                ),
                ap_umsetzung: get(
                  z,
                  'vPopAnzmassnsById.nodes[0].apUmsetzung',
                  '',
                ),
                id: get(z, 'vPopAnzmassnsById.nodes[0].id', ''),
                nr: get(z, 'vPopAnzmassnsById.nodes[0].nr', ''),
                name: get(z, 'vPopAnzmassnsById.nodes[0].name', ''),
                status: get(z, 'vPopAnzmassnsById.nodes[0].status', ''),
                bekannt_seit: get(
                  z,
                  'vPopAnzmassnsById.nodes[0].bekanntSeit',
                  '',
                ),
                status_unklar: get(
                  z,
                  'vPopAnzmassnsById.nodes[0].statusUnklar',
                  '',
                ),
                status_unklar_begruendung: get(
                  z,
                  'vPopAnzmassnsById.nodes[0].statusUnklarBegruendung',
                  '',
                ),
                x: get(z, 'vPopAnzmassnsById.nodes[0].x', ''),
                y: get(z, 'vPopAnzmassnsById.nodes[0].y', ''),
                anzahl_massnahmen: get(
                  z,
                  'vPopAnzmassnsById.nodes[0].anzahlMassnahmen',
                  '',
                ),
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
              const rows = get(result?.data, 'allPops.nodes', []).map((z) => ({
                ap_id: get(z, 'vPopAnzkontrsById.nodes[0].apId', ''),
                artname: get(z, 'vPopAnzkontrsById.nodes[0].artname', ''),
                ap_bearbeitung: get(
                  z,
                  'vPopAnzkontrsById.nodes[0].apBearbeitung',
                  '',
                ),
                ap_start_jahr: get(
                  z,
                  'vPopAnzkontrsById.nodes[0].apStartJahr',
                  '',
                ),
                ap_umsetzung: get(
                  z,
                  'vPopAnzkontrsById.nodes[0].apUmsetzung',
                  '',
                ),
                id: get(z, 'vPopAnzkontrsById.nodes[0].id', ''),
                nr: get(z, 'vPopAnzkontrsById.nodes[0].nr', ''),
                name: get(z, 'vPopAnzkontrsById.nodes[0].name', ''),
                status: get(z, 'vPopAnzkontrsById.nodes[0].status', ''),
                bekannt_seit: get(
                  z,
                  'vPopAnzkontrsById.nodes[0].bekanntSeit',
                  '',
                ),
                status_unklar: get(
                  z,
                  'vPopAnzkontrsById.nodes[0].statusUnklar',
                  '',
                ),
                status_unklar_begruendung: get(
                  z,
                  'vPopAnzkontrsById.nodes[0].statusUnklarBegruendung',
                  '',
                ),
                x: get(z, 'vPopAnzkontrsById.nodes[0].x', ''),
                y: get(z, 'vPopAnzkontrsById.nodes[0].y', ''),
                anzahl_kontrollen: get(
                  z,
                  'vPopAnzkontrsById.nodes[0].anzahlKontrollen',
                  '',
                ),
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
              const rows = get(result?.data, 'allPops.nodes', []).flatMap(
                (z0) =>
                  get(z0, 'vPopPopberundmassnbersByPopId.nodes', []).map(
                    (z) => ({
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
                      pop_status_unklar_begruendung:
                        z.popStatusUnklarBegruendung,
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
                    }),
                  ),
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
              const rows = get(result?.data, 'allPops.nodes', []).map((z) => ({
                ap_id: get(z, 'vPopMitLetzterPopbersByPopId.nodes[0].apId', ''),
                artname: get(
                  z,
                  'vPopMitLetzterPopbersByPopId.nodes[0].artname',
                  '',
                ),
                ap_bearbeitung: get(
                  z,
                  'vPopMitLetzterPopbersByPopId.nodes[0].apBearbeitung',
                  '',
                ),
                ap_start_jahr: get(
                  z,
                  'vPopMitLetzterPopbersByPopId.nodes[0].apStartJahr',
                  '',
                ),
                ap_umsetzung: get(
                  z,
                  'vPopMitLetzterPopbersByPopId.nodes[0].apUmsetzung',
                  '',
                ),
                pop_id: get(
                  z,
                  'vPopMitLetzterPopbersByPopId.nodes[0].popId',
                  '',
                ),
                pop_nr: get(
                  z,
                  'vPopMitLetzterPopbersByPopId.nodes[0].popNr',
                  '',
                ),
                pop_name: get(
                  z,
                  'vPopMitLetzterPopbersByPopId.nodes[0].popName',
                  '',
                ),
                pop_status: get(
                  z,
                  'vPopMitLetzterPopbersByPopId.nodes[0].popStatus',
                  '',
                ),
                pop_bekannt_seit: get(
                  z,
                  'vPopMitLetzterPopbersByPopId.nodes[0].popBekanntSeit',
                  '',
                ),
                pop_status_unklar: get(
                  z,
                  'vPopMitLetzterPopbersByPopId.nodes[0].popStatusUnklar',
                  '',
                ),
                pop_status_unklar_begruendung: get(
                  z,
                  'vPopMitLetzterPopbersByPopId.nodes[0].popStatusUnklarBegruendung',
                  '',
                ),
                pop_x: get(z, 'vPopMitLetzterPopbersByPopId.nodes[0].popX', ''),
                pop_y: get(z, 'vPopMitLetzterPopbersByPopId.nodes[0].popY', ''),
                pop_changed: get(
                  z,
                  'vPopMitLetzterPopbersByPopId.nodes[0].popChanged',
                  '',
                ),
                pop_changed_by: get(
                  z,
                  'vPopMitLetzterPopbersByPopId.nodes[0].popChangedBy',
                  '',
                ),
                popber_id: get(
                  z,
                  'vPopMitLetzterPopbersByPopId.nodes[0].popberId',
                  '',
                ),
                popber_jahr: get(
                  z,
                  'vPopMitLetzterPopbersByPopId.nodes[0].popberJahr',
                  '',
                ),
                popber_entwicklung: get(
                  z,
                  'vPopMitLetzterPopbersByPopId.nodes[0].popberEntwicklung',
                  '',
                ),
                popber_bemerkungen: get(
                  z,
                  'vPopMitLetzterPopbersByPopId.nodes[0].popberBemerkungen',
                  '',
                ),
                popber_changed: get(
                  z,
                  'vPopMitLetzterPopbersByPopId.nodes[0].popberChanged',
                  '',
                ),
                popber_changed_by: get(
                  z,
                  'vPopMitLetzterPopbersByPopId.nodes[0].popberChangedBy',
                  '',
                ),
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
              const rows = get(result?.data, 'allPops.nodes', []).map((z) => ({
                ap_id: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].apId',
                  '',
                ),
                artname: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].artname',
                  '',
                ),
                ap_bearbeitung: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].apBearbeitung',
                  '',
                ),
                ap_start_jahr: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].apStartJahr',
                  '',
                ),
                ap_umsetzung: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].apUmsetzung',
                  '',
                ),
                pop_id: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].popId',
                  '',
                ),
                pop_nr: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].popNr',
                  '',
                ),
                pop_name: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].popName',
                  '',
                ),
                pop_status: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].popStatus',
                  '',
                ),
                pop_bekannt_seit: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].popBekanntSeit',
                  '',
                ),
                pop_status_unklar: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].popStatusUnklar',
                  '',
                ),
                pop_status_unklar_begruendung: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].popStatusUnklarBegruendung',
                  '',
                ),
                pop_x: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].popX',
                  '',
                ),
                pop_y: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].popY',
                  '',
                ),
                pop_changed: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].popChanged',
                  '',
                ),
                pop_changed_by: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].popChangedBy',
                  '',
                ),
                popmassnber_id: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].popmassnberId',
                  '',
                ),
                popmassnber_jahr: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].popmassnberJahr',
                  '',
                ),
                popmassnber_entwicklung: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].popmassnberEntwicklung',
                  '',
                ),
                popmassnber_bemerkungen: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].popmassnberBemerkungen',
                  '',
                ),
                popmassnber_changed: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].popmassnberChanged',
                  '',
                ),
                popmassnber_changed_by: get(
                  z,
                  'vPopMitLetzterPopmassnbersByPopId.nodes[0].popmassnberChangedBy',
                  '',
                ),
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
              const rows = get(result?.data, 'allPops.nodes', []).map((z) => ({
                artname: get(z, 'vPopLastCountsByPopId.nodes[0].artname', ''),
                ap_id: get(z, 'vPopLastCountsByPopId.nodes[0].apId', ''),
                pop_id: get(z, 'vPopLastCountsByPopId.nodes[0].popId', ''),
                pop_nr: get(z, 'vPopLastCountsByPopId.nodes[0].popNr', ''),
                pop_name: get(z, 'vPopLastCountsByPopId.nodes[0].popName', ''),
                pop_status: get(
                  z,
                  'vPopLastCountsByPopId.nodes[0].popStatus',
                  '',
                ),
                jahre: get(z, 'vPopLastCountsByPopId.nodes[0].jahre', ''),
                pflanzen: get(z, 'vPopLastCountsByPopId.nodes[0].pflanzen', ''),
                pflanzen_ohne_jungpflanzen: get(
                  z,
                  'vPopLastCountsByPopId.nodes[0].pflanzenOhneJungpflanzen',
                  '',
                ),
                triebe: get(z, 'vPopLastCountsByPopId.nodes[0].triebe', ''),
                triebe_beweidung: get(
                  z,
                  'vPopLastCountsByPopId.nodes[0].triebeBeweidung',
                  '',
                ),
                keimlinge: get(
                  z,
                  'vPopLastCountsByPopId.nodes[0].keimlinge',
                  '',
                ),
                rosetten: get(z, 'vPopLastCountsByPopId.nodes[0].rosetten', ''),
                jungpflanzen: get(
                  z,
                  'vPopLastCountsByPopId.nodes[0].jungpflanzen',
                  '',
                ),
                blaetter: get(z, 'vPopLastCountsByPopId.nodes[0].blatter', ''),
                bluehende_pflanzen: get(
                  z,
                  'vPopLastCountsByPopId.nodes[0].bluhendePflanzen',
                  '',
                ),
                bluehende_triebe: get(
                  z,
                  'vPopLastCountsByPopId.nodes[0].bluhendeTriebe',
                  '',
                ),
                blueten: get(z, 'vPopLastCountsByPopId.nodes[0].bluten', ''),
                fertile_pflanzen: get(
                  z,
                  'vPopLastCountsByPopId.nodes[0].fertilePflanzen',
                  '',
                ),
                fruchtende_triebe: get(
                  z,
                  'vPopLastCountsByPopId.nodes[0].fruchtendeTriebe',
                  '',
                ),
                bluetenstaende: get(
                  z,
                  'vPopLastCountsByPopId.nodes[0].blutenstande',
                  '',
                ),
                fruchtstaende: get(
                  z,
                  'vPopLastCountsByPopId.nodes[0].fruchtstande',
                  '',
                ),
                gruppen: get(z, 'vPopLastCountsByPopId.nodes[0].gruppen', ''),
                deckung: get(z, 'vPopLastCountsByPopId.nodes[0].deckung', ''),
                pflanzen_5m2: get(
                  z,
                  'vPopLastCountsByPopId.nodes[0].pflanzen5M2',
                  '',
                ),
                triebe_in_30m2: get(
                  z,
                  'vPopLastCountsByPopId.nodes[0].triebeIn30M2',
                  '',
                ),
                triebe_50m2: get(
                  z,
                  'vPopLastCountsByPopId.nodes[0].triebe50M2',
                  '',
                ),
                triebe_maehflaeche: get(
                  z,
                  'vPopLastCountsByPopId.nodes[0].triebeMahflache',
                  '',
                ),
                flaeche_m2: get(
                  z,
                  'vPopLastCountsByPopId.nodes[0].flacheM2',
                  '',
                ),
                pflanzstellen: get(
                  z,
                  'vPopLastCountsByPopId.nodes[0].pflanzstellen',
                  '',
                ),
                stellen: get(z, 'vPopLastCountsByPopId.nodes[0].stellen', ''),
                andere_zaehleinheit: get(
                  z,
                  'vPopLastCountsByPopId.nodes[0].andereZaehleinheit',
                  '',
                ),
                art_ist_vorhanden: get(
                  z,
                  'vPopLastCountsByPopId.nodes[0].artIstVorhanden',
                  '',
                ),
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
              const rows = get(result?.data, 'allPops.nodes', []).map((z) => ({
                artname: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].artname',
                  '',
                ),
                ap_id: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].apId',
                  '',
                ),
                pop_id: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].popId',
                  '',
                ),
                pop_nr: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].popNr',
                  '',
                ),
                pop_name: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].popName',
                  '',
                ),
                pop_status: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].popStatus',
                  '',
                ),
                jahre: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].jahre',
                  '',
                ),
                pflanzen: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].pflanzen',
                  '',
                ),
                pflanzen_ohne_jungpflanzen: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].pflanzenOhneJungpflanzen',
                  '',
                ),
                triebe: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].triebe',
                  '',
                ),
                triebe_beweidung: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].triebeBeweidung',
                  '',
                ),
                keimlinge: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].keimlinge',
                  '',
                ),
                rosetten: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].rosetten',
                  '',
                ),
                jungpflanzen: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].jungpflanzen',
                  '',
                ),
                blaetter: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].blatter',
                  '',
                ),
                bluehende_pflanzen: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].bluhendePflanzen',
                  '',
                ),
                bluehende_triebe: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].bluhendeTriebe',
                  '',
                ),
                blueten: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].bluten',
                  '',
                ),
                fertile_pflanzen: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].fertilePflanzen',
                  '',
                ),
                fruchtende_triebe: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].fruchtendeTriebe',
                  '',
                ),
                bluetenstaende: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].blutenstande',
                  '',
                ),
                fruchtstaende: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].fruchtstande',
                  '',
                ),
                gruppen: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].gruppen',
                  '',
                ),
                deckung: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].deckung',
                  '',
                ),
                pflanzen_5m2: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].pflanzen5M2',
                  '',
                ),
                triebe_in_30m2: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].triebeIn30M2',
                  '',
                ),
                triebe_50m2: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].triebe50M2',
                  '',
                ),
                triebe_maehflaeche: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].triebeMahflache',
                  '',
                ),
                flaeche_m2: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].flacheM2',
                  '',
                ),
                pflanzstellen: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].pflanzstellen',
                  '',
                ),
                stellen: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].stellen',
                  '',
                ),
                andere_zaehleinheit: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].andereZaehleinheit',
                  '',
                ),
                art_ist_vorhanden: get(
                  z,
                  'vPopLastCountWithMassnsByPopId.nodes[0].artIstVorhanden',
                  '',
                ),
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
