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

const Massnahmen = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const {
    enqueNotification,
    removeNotification,
    dataFilterTableIsFiltered,
    tpopmassnGqlFilter,
  } = store
  const [expanded, setExpanded] = useState(false)
  const { closeSnackbar } = useSnackbar()

  const tpopmassnIsFiltered = dataFilterTableIsFiltered({
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
                message: `Export "Massnahmen" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
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
                          tpopkontrzaehlEinheitWerteByZieleinheitEinheit {
                            id
                            text
                          }
                          zieleinheitAnzahl
                          wirtspflanze
                          herkunftPop
                          sammeldatum
                          vonAnzahlIndividuen
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
              } catch (error) {
                enqueNotification({
                  message: error.message,
                  options: {
                    variant: 'error',
                  },
                })
              }
              const rows = (result.data?.allTpopmassns.nodes ?? []).map(
                (n) => ({
                  apId: n?.tpopByTpopId?.popByPopId?.apByApId?.id ?? null,
                  apFamilie:
                    n?.tpopByTpopId?.popByPopId?.apByApId?.aeTaxonomyByArtId
                      ?.familie ?? null,
                  apArtname:
                    n?.tpopByTpopId?.popByPopId?.apByApId?.aeTaxonomyByArtId
                      ?.artname ?? null,
                  apBearbeitung:
                    n?.tpopByTpopId?.popByPopId?.apByApId
                      ?.apBearbstandWerteByBearbeitung?.text ?? null,
                  apStartJahr:
                    n?.tpopByTpopId?.popByPopId?.apByApId?.startJahr ?? null,
                  apUmsetzung:
                    n?.tpopByTpopId?.popByPopId?.apByApId
                      ?.apUmsetzungWerteByUmsetzung?.text ?? null,
                  popId: n?.tpopByTpopId?.popByPopId?.id ?? null,
                  popNr: n?.tpopByTpopId?.popByPopId?.nr ?? null,
                  popName: n?.tpopByTpopId?.popByPopId?.name ?? null,
                  popStatus:
                    n?.tpopByTpopId?.popByPopId?.popStatusWerteByStatus?.text ??
                    null,
                  popBekanntSeit:
                    n?.tpopByTpopId?.popByPopId?.bekanntSeit ?? null,
                  popStatusUnklar:
                    n?.tpopByTpopId?.popByPopId?.statusUnklar ?? null,
                  popStatusUnklarBegruendung:
                    n?.tpopByTpopId?.popByPopId?.statusUnklarBegruendung ??
                    null,
                  popX: n?.tpopByTpopId?.popByPopId?.x ?? null,
                  popY: n?.tpopByTpopId?.popByPopId?.y ?? null,
                  tpopId: n?.tpopByTpopId?.id ?? null,
                  tpopNr: n?.tpopByTpopId?.nr ?? null,
                  tpopGemeinde: n?.tpopByTpopId?.gemeinde ?? null,
                  tpopFlurname: n?.tpopByTpopId?.flurname ?? null,
                  tpopStatus: n?.tpopByTpopId?.status ?? null,
                  statusDecodiert:
                    n?.tpopByTpopId?.popStatusWerteByStatus?.text ?? null,
                  tpopBekanntSeit: n?.tpopByTpopId?.bekanntSeit ?? null,
                  tpopStatusUnklar: n?.tpopByTpopId?.statusUnklar ?? null,
                  tpopStatusUnklarGrund:
                    n?.tpopByTpopId?.statusUnklarGrund ?? null,
                  tpopX: n?.tpopByTpopId?.x ?? null,
                  tpopY: n?.tpopByTpopId?.y ?? null,
                  tpopRadius: n?.tpopByTpopId?.radius ?? null,
                  tpopHoehe: n?.tpopByTpopId?.hoehe ?? null,
                  tpopExposition: n?.tpopByTpopId?.exposition ?? null,
                  tpopKlima: n?.tpopByTpopId?.klima ?? null,
                  tpopNeigung: n?.tpopByTpopId?.neigung ?? null,
                  tpopBeschreibung: n?.tpopByTpopId?.beschreibung ?? null,
                  tpopKatasterNr: n?.tpopByTpopId?.katasterNr ?? null,
                  tpopApberRelevant: n?.tpopByTpopId?.apberRelevant ?? null,
                  tpopApberRelevantGrund:
                    n?.tpopByTpopId?.apberRelevantGrund ?? null,
                  tpopEigentuemer: n?.tpopByTpopId?.eigentuemer ?? null,
                  tpopKontakt: n?.tpopByTpopId?.kontakt ?? null,
                  tpopNutzungszone: n?.tpopByTpopId?.nutzungszone ?? null,
                  tpopBewirtschafter: n?.tpopByTpopId?.bewirtschafter ?? null,
                  tpopBewirtschaftung: n?.tpopByTpopId?.bewirtschaftung ?? null,
                  tpopEkfrequenz: n?.tpopByTpopId?.ekfrequenz ?? null,
                  tpopEkfrequenzAbweichend:
                    n?.tpopByTpopId?.ekfrequenzAbweichend ?? null,
                  tpopEkfKontrolleur:
                    n?.tpopByTpopId?.adresseByEkfKontrolleur?.name ?? null,
                  id: n.id,
                  jahr: n.jahr,
                  datum: n.datum,
                  typ: n?.tpopmassnTypWerteByTyp?.text ?? null,
                  beschreibung: n.beschreibung,
                  bearbeiter: n?.adresseByBearbeiter?.name ?? null,
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
                  zieleinheitEinheit:
                    n?.tpopkontrzaehlEinheitWerteByZieleinheitEinheit?.text ??
                    null,
                  zieleinheitAnzahl: n.zieleinheitAnzahl,
                  wirtspflanze: n.wirtspflanze,
                  herkunftPop: n.herkunftPop,
                  sammeldatum: n.sammeldatum,
                  vonAnzahlIndividuen: n.vonAnzahlIndividuen,
                  changed: n.changed,
                  changedBy: n.changedBy,
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
              exportModule({
                data: rows,
                fileName: 'Massnahmen',
                idKey: 'tpop_id',
                xKey: 'tpop_wgs84lat',
                yKey: 'tpop_wgs84long',
                store,
              })
            }}
          >
            {tpopmassnIsFiltered ? 'Massnahmen (gefiltert)' : 'Massnahmen'}
          </DownloadCardButton>
          <DownloadCardButton
            color="inherit"
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "MassnahmenWebGisBun" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./allVMassnWebgisbuns').then(
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
              const rows = result.data?.allVMassnWebgisbuns.nodes ?? []
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
                fileName: 'MassnahmenWebGisBun',
                idKey: 'TPOPGUID',
                xKey: 'TPOP_WGS84LAT',
                yKey: 'TPOP_WGS84LONG',
                store,
              })
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
