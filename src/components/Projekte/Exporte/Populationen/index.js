import React, { useContext, useState } from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/react-hooks'
import { useSnackbar } from 'notistack'
import gql from 'graphql-tag'

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
              const rows = get(result.data, 'allPops.nodes', []).map((n) => ({
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
                  query: await import('./allVPopKmls').then((m) => m.default),
                })
              } catch (error) {
                enqueNotification({
                  message: error.message,
                  options: {
                    variant: 'error',
                  },
                })
              }
              const rows = get(result.data, 'allVPopKmls.nodes', [])
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
                  query: await import('./allVPopKmlnamen').then(
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
              const rows = get(result.data, 'allVPopKmlnamen.nodes', [])
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
                  query: await import('./allVPopVonapohnestatuses').then(
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
              const rows = get(
                result.data,
                'allVPopVonapohnestatuses.nodes',
                [],
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
                data: rows,
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
                  query: await import('./allVPopOhnekoords').then(
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
              const rows = get(result.data, 'allVPopOhnekoords.nodes', [])
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
                  query: await import('./allVPopmassnberAnzmassns').then(
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
              const rows = get(
                result.data,
                'allVPopmassnberAnzmassns.nodes',
                [],
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
                data: rows,
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
                  query: await import('./allVPopAnzmassns').then(
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
              const rows = get(result.data, 'allVPopAnzmassns.nodes', [])
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
                  query: await import('./allVPopAnzkontrs').then(
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
              const rows = get(result.data, 'allVPopAnzkontrs.nodes', [])
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
                  query: await import('./allVPopPopberundmassnbers').then(
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
              const rows = get(
                result.data,
                'allVPopPopberundmassnbers.nodes',
                [],
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
                data: rows,
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
                  query: await import('./allVPopMitLetzterPopbers').then(
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
              const rows = get(
                result.data,
                'allVPopMitLetzterPopbers.nodes',
                [],
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
                data: rows,
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
                  query: await import('./allVPopMitLetzterPopmassnbers').then(
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
              const rows = get(
                result.data,
                'allVPopMitLetzterPopmassnbers.nodes',
                [],
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
                data: rows,
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
                  query: await import('./allVPopLastCounts').then(
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
              const rows = get(result.data, 'allVPopLastCounts.nodes', [])
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
                  query: await import('./allVPopLastCountWithMassns').then(
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
              const rows = get(
                result.data,
                'allVPopLastCountWithMassns.nodes',
                [],
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
                data: rows,
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
