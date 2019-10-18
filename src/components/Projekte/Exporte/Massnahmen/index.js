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
  transform: ${props => (props['data-expanded'] ? 'rotate(180deg)' : 'none')};
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

const Massnahmen = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const {
    enqueNotification,
    removeNotification,
    nodeFilterTableIsFiltered,
    tpopmassnGqlFilter,
  } = store
  const [expanded, setExpanded] = useState(false)
  const { closeSnackbar } = useSnackbar()

  const tpopmassnIsFiltered = nodeFilterTableIsFiltered({
    treeName: 'tree',
    table: 'tpopmassn',
  })

  return (
    <StyledCard>
      <StyledCardActions disableSpacing onClick={() => setExpanded(!expanded)}>
        <CardActionTitle>Massnahmen</CardActionTitle>
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
                message: `Export "Massnahmen" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              try {
                const { data } = await client.query({
                  query: gql`
                    query tpopmassnForExportQuery($filter: TpopmassnFilter) {
                      allTpopmassns(
                        filter: $filter
                        orderBy: [
                          AP_NAME_ASC
                          POP_NR_ASC
                          TPOP_BY_TPOP_ID__NR_ASC
                          DATUM_ASC
                        ]
                      ) {
                        nodes {
                          tpopByTpopId {
                            popByPopId {
                              apByApId {
                                id
                                aeTaxonomyByArtId {
                                  id
                                  artname
                                  familie
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
                            }
                            id
                            nr
                            gemeinde
                            flurname
                            status
                            popStatusWerteByStatus {
                              id
                              text
                            }
                            bekanntSeit
                            statusUnklar
                            statusUnklarGrund
                            x: lv95X
                            y: lv95Y
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
                            ekfrequenz
                            ekfrequenzAbweichend
                            adresseByEkfKontrolleur {
                              id
                              name
                            }
                          }
                          id
                          jahr
                          datum
                          tpopmassnTypWerteByTyp {
                            id
                            text
                          }
                          beschreibung
                          adresseByBearbeiter {
                            id
                            name
                          }
                          bemerkungen
                          planVorhanden
                          planBezeichnung
                          flaeche
                          form
                          pflanzanordnung
                          markierung
                          anzTriebe
                          anzPflanzen
                          anzPflanzstellen
                          wirtspflanze
                          herkunftPop
                          sammeldatum
                          changed
                          changedBy
                        }
                      }
                    }
                  `,
                  variables: {
                    filter: tpopmassnGqlFilter,
                  },
                })
                const dataToExport = get(data, 'allTpopmassns.nodes', []).map(
                  n => ({
                    apId: get(n, 'tpopByTpopId.popByPopId.apByApId.id') || null,
                    apFamilie:
                      get(
                        n,
                        'tpopByTpopId.popByPopId.apByApId.aeTaxonomyByArtId.familie',
                      ) || null,
                    apArtname:
                      get(
                        n,
                        'tpopByTpopId.popByPopId.apByApId.aeTaxonomyByArtId.artname',
                      ) || null,
                    apBearbeitung:
                      get(
                        n,
                        'tpopByTpopId.popByPopId.apByApId.apBearbstandWerteByBearbeitung.text',
                      ) || null,
                    apStartJahr:
                      get(n, 'tpopByTpopId.popByPopId.apByApId.startJahr') ||
                      null,
                    apUmsetzung:
                      get(
                        n,
                        'tpopByTpopId.popByPopId.apByApId.apUmsetzungWerteByUmsetzung.text',
                      ) || null,
                    popId: get(n, 'tpopByTpopId.popByPopId.id') || null,
                    popNr: get(n, 'tpopByTpopId.popByPopId.nr') || null,
                    popName: get(n, 'tpopByTpopId.popByPopId.name') || null,
                    popStatus:
                      get(
                        n,
                        'tpopByTpopId.popByPopId.popStatusWerteByStatus.text',
                      ) || null,
                    popBekanntSeit:
                      get(n, 'tpopByTpopId.popByPopId.bekanntSeit') || null,
                    popStatusUnklar:
                      get(n, 'tpopByTpopId.popByPopId.statusUnklar') || null,
                    popStatusUnklarBegruendung:
                      get(
                        n,
                        'tpopByTpopId.popByPopId.statusUnklarBegruendung',
                      ) || null,
                    popX: get(n, 'tpopByTpopId.popByPopId.x') || null,
                    popY: get(n, 'tpopByTpopId.popByPopId.y') || null,
                    tpopId: get(n, 'tpopByTpopId.id') || null,
                    tpopNr: get(n, 'tpopByTpopId.nr') || null,
                    tpopGemeinde: get(n, 'tpopByTpopId.gemeinde') || null,
                    tpopFlurname: get(n, 'tpopByTpopId.flurname') || null,
                    tpopStatus: get(n, 'tpopByTpopId.status') || null,
                    statusDecodiert:
                      get(n, 'tpopByTpopId.popStatusWerteByStatus.text') ||
                      null,
                    tpopBekanntSeit: get(n, 'tpopByTpopId.bekanntSeit') || null,
                    tpopStatusUnklar:
                      get(n, 'tpopByTpopId.statusUnklar') || null,
                    tpopStatusUnklarGrund:
                      get(n, 'tpopByTpopId.statusUnklarGrund') || null,
                    tpopX: get(n, 'tpopByTpopId.x') || null,
                    tpopY: get(n, 'tpopByTpopId.y') || null,
                    tpopRadius: get(n, 'tpopByTpopId.radius') || null,
                    tpopHoehe: get(n, 'tpopByTpopId.hoehe') || null,
                    tpopExposition: get(n, 'tpopByTpopId.exposition') || null,
                    tpopKlima: get(n, 'tpopByTpopId.klima') || null,
                    tpopNeigung: get(n, 'tpopByTpopId.neigung') || null,
                    tpopBeschreibung:
                      get(n, 'tpopByTpopId.beschreibung') || null,
                    tpopKatasterNr: get(n, 'tpopByTpopId.katasterNr') || null,
                    tpopApberRelevant:
                      get(n, 'tpopByTpopId.apberRelevant') || null,
                    tpopApberRelevantGrund:
                      get(n, 'tpopByTpopId.apberRelevantGrund') || null,
                    tpopEigentuemer: get(n, 'tpopByTpopId.eigentuemer') || null,
                    tpopKontakt: get(n, 'tpopByTpopId.kontakt') || null,
                    tpopNutzungszone:
                      get(n, 'tpopByTpopId.nutzungszone') || null,
                    tpopBewirtschafter:
                      get(n, 'tpopByTpopId.bewirtschafter') || null,
                    tpopBewirtschaftung:
                      get(n, 'tpopByTpopId.bewirtschaftung') || null,
                    tpopEkfrequenz: get(n, 'tpopByTpopId.ekfrequenz') || null,
                    tpopEkfrequenzAbweichend:
                      get(n, 'tpopByTpopId.ekfrequenzAbweichend') || null,
                    tpopEkfKontrolleur:
                      get(n, 'tpopByTpopId.adresseByEkfKontrolleur.name') ||
                      null,
                    id: n.id,
                    jahr: n.jahr,
                    datum: n.datum,
                    typ: get(n, 'tpopmassnTypWerteByTyp.text') || null,
                    beschreibung: n.beschreibung,
                    bearbeiter: get(n, 'adresseByBearbeiter.name') || null,
                    bemerkungen: n.bemerkungen,
                    planVorhanden: n.planVorhanden,
                    planBezeichnung: n.planBezeichnung,
                    flaeche: n.flaeche,
                    form: n.form,
                    pflanzanordnung: n.pflanzanordnung,
                    markierung: n.markierung,
                    anzTriebe: n.anzTriebe,
                    anzPflanzen: n.anzPflanzen,
                    anzPflanzstellen: n.anzPflanzstellen,
                    wirtspflanze: n.wirtspflanze,
                    herkunftPop: n.herkunftPop,
                    sammeldatum: n.sammeldatum,
                    changed: n.changed,
                    changedBy: n.changedBy,
                  }),
                )
                exportModule({
                  data: dataToExport,
                  fileName: 'Massnahmen',
                  idKey: 'tpop_id',
                  xKey: 'tpop_wgs84lat',
                  yKey: 'tpop_wgs84long',
                  store,
                })
              } catch (error) {
                enqueNotification({
                  message: error.message,
                  options: {
                    variant: 'error',
                  },
                })
              }
              removeNotification(notif)
              closeSnackbar(notif)
            }}
          >
            {tpopmassnIsFiltered ? 'Massnahmen (gefiltert)' : 'Massnahmen'}
          </DownloadCardButton>
          <DownloadCardButton
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "MassnahmenWebGisBun" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              try {
                const { data } = await client.query({
                  query: await import('./allVMassnWebgisbuns').then(
                    m => m.default,
                  ),
                })
                exportModule({
                  data: get(data, 'allVMassnWebgisbuns.nodes', []),
                  fileName: 'MassnahmenWebGisBun',
                  idKey: 'TPOPGUID',
                  xKey: 'TPOP_WGS84LAT',
                  yKey: 'TPOP_WGS84LONG',
                  store,
                })
              } catch (error) {
                enqueNotification({
                  message: error.message,
                  options: {
                    variant: 'error',
                  },
                })
              }
              removeNotification(notif)
              closeSnackbar(notif)
            }}
          >
            Massnahmen für WebGIS BUN
          </DownloadCardButton>
        </StyledCardContent>
      </Collapse>
    </StyledCard>
  )
}

export default observer(Massnahmen)
