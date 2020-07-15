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

const Kontrollen = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const {
    enqueNotification,
    removeNotification,
    dataFilterTableIsFiltered,
    tpopkontrGqlFilter,
  } = store
  const [expanded, setExpanded] = useState(false)
  const { closeSnackbar } = useSnackbar()

  const tpopkontrIsFiltered =
    dataFilterTableIsFiltered({
      treeName: 'tree',
      table: 'tpopfreiwkontr',
    }) ||
    dataFilterTableIsFiltered({
      treeName: 'tree',
      table: 'tpopfeldkontr',
    })

  return (
    <StyledCard>
      <StyledCardActions disableSpacing onClick={() => setExpanded(!expanded)}>
        <CardActionTitle>Kontrollen</CardActionTitle>
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
                message: `Export "Kontrollen" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: gql`
                    query tpopkontrForExportQuery($filter: TpopkontrFilter) {
                      allTpopkontrs(
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
                            kataster_nr: katasterNr
                            apber_relevant: apberRelevant
                            apber_relevant_grund: apberRelevantGrund
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
                          tpopkontrTypWerteByTyp {
                            id
                            text
                          }
                          adresseByBearbeiter {
                            id
                            name
                          }
                          ueberlebensrate
                          vitalitaet
                          tpopEntwicklungWerteByEntwicklung {
                            id
                            text
                          }
                          ursachen
                          erfolgsbeurteilung
                          umsetzungAendern
                          kontrolleAendern
                          bemerkungen
                          lrDelarze
                          lrUmgebungDelarze
                          vegetationstyp
                          konkurrenz
                          moosschicht
                          krautschicht
                          strauchschicht
                          baumschicht
                          bodenTyp
                          bodenKalkgehalt
                          bodenDurchlaessigkeit
                          bodenHumus
                          bodenNaehrstoffgehalt
                          bodenAbtrag
                          wasserhaushalt
                          tpopkontrIdbiotuebereinstWerteByIdealbiotopUebereinstimmung {
                            id
                            text
                          }
                          handlungsbedarf
                          flaecheUeberprueft
                          flaeche
                          planVorhanden
                          deckungVegetation
                          deckungNackterBoden
                          deckungApArt
                          jungpflanzenVorhanden
                          vegetationshoeheMaximum
                          vegetationshoeheMittel
                          gefaehrdung
                          changed
                          changedBy
                          apberNichtRelevant
                          apberNichtRelevantGrund
                          ekfBemerkungen
                          tpopkontrzaehlsByTpopkontrId {
                            nodes {
                              id
                              anzahl
                              tpopkontrzaehlEinheitWerteByEinheit {
                                id
                                text
                              }
                              tpopkontrzaehlMethodeWerteByMethode {
                                id
                                text
                              }
                            }
                          }
                        }
                      }
                    }
                  `,
                  variables: {
                    filter: tpopkontrGqlFilter,
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
              const rows = get(result.data, 'allTpopkontrs.nodes', []).map(
                (n) => ({
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
                    get(n, 'tpopByTpopId.popByPopId.statusUnklarBegruendung') ||
                    null,
                  popX: get(n, 'tpopByTpopId.popByPopId.x') || null,
                  popY: get(n, 'tpopByTpopId.popByPopId.y') || null,
                  tpopId: get(n, 'tpopByTpopId.id') || null,
                  tpopNr: get(n, 'tpopByTpopId.nr') || null,
                  tpopGemeinde: get(n, 'tpopByTpopId.gemeinde') || null,
                  tpopFlurname: get(n, 'tpopByTpopId.flurname') || null,
                  tpopStatus: get(n, 'tpopByTpopId.status') || null,
                  statusDecodiert:
                    get(n, 'tpopByTpopId.popStatusWerteByStatus.text') || null,
                  tpopBekanntSeit: get(n, 'tpopByTpopId.bekanntSeit') || null,
                  tpopStatusUnklar: get(n, 'tpopByTpopId.statusUnklar') || null,
                  tpopStatusUnklarGrund:
                    get(n, 'tpopByTpopId.statusUnklarGrund') || null,
                  tpopX: get(n, 'tpopByTpopId.x') || null,
                  tpopY: get(n, 'tpopByTpopId.y') || null,
                  tpopRadius: get(n, 'tpopByTpopId.radius') || null,
                  tpopHoehe: get(n, 'tpopByTpopId.hoehe') || null,
                  tpopExposition: get(n, 'tpopByTpopId.exposition') || null,
                  tpopKlima: get(n, 'tpopByTpopId.klima') || null,
                  tpopNeigung: get(n, 'tpopByTpopId.neigung') || null,
                  tpopBeschreibung: get(n, 'tpopByTpopId.beschreibung') || null,
                  tpopKatasterNr: get(n, 'tpopByTpopId.katasterNr') || null,
                  tpopApberRelevant:
                    get(n, 'tpopByTpopId.apberRelevant') || null,
                  tpopApberRelevantGrund:
                    get(n, 'tpopByTpopId.apberRelevantGrund') || null,
                  tpopEigentuemer: get(n, 'tpopByTpopId.eigentuemer') || null,
                  tpopKontakt: get(n, 'tpopByTpopId.kontakt') || null,
                  tpopNutzungszone: get(n, 'tpopByTpopId.nutzungszone') || null,
                  tpopBewirtschafter:
                    get(n, 'tpopByTpopId.bewirtschafter') || null,
                  tpopBewirtschaftung:
                    get(n, 'tpopByTpopId.bewirtschaftung') || null,
                  tpopEkfrequenz: get(n, 'tpopByTpopId.ekfrequenz') || null,
                  tpopEkfrequenzAbweichend:
                    get(n, 'tpopByTpopId.ekfrequenzAbweichend') || null,
                  tpopEkfKontrolleur:
                    get(n, 'tpopByTpopId.adresseByEkfKontrolleur.name') || null,
                  id: n.id,
                  jahr: n.jahr,
                  datum: n.datum,
                  typ: get(n, 'tpopkontrTypWerteByTyp.text') || null,
                  bearbeiter: get(n, 'adresseByBearbeiter.name') || null,
                  ueberlebensrate: n.ueberlebensrate,
                  vitalitaet: n.vitalitaet,
                  entwicklung:
                    get(n, 'tpopEntwicklungWerteByEntwicklung.text') || null,
                  ursachen: n.ursachen,
                  erfolgsbeurteilung: n.erfolgsbeurteilung,
                  umsetzungAendern: n.umsetzungAendern,
                  kontrolleAendern: n.kontrolleAendern,
                  bemerkungen: n.bemerkungen,
                  lrDelarze: n.lrDelarze,
                  lrUmgebungDelarze: n.lrUmgebungDelarze,
                  vegetationstyp: n.vegetationstyp,
                  konkurrenz: n.konkurrenz,
                  moosschicht: n.moosschicht,
                  krautschicht: n.krautschicht,
                  strauchschicht: n.strauchschicht,
                  baumschicht: n.baumschicht,
                  bodenTyp: n.bodenTyp,
                  bodenKalkgehalt: n.bodenKalkgehalt,
                  bodenDurchlaessigkeit: n.bodenDurchlaessigkeit,
                  bodenHumus: n.bodenHumus,
                  bodenNaehrstoffgehalt: n.bodenNaehrstoffgehalt,
                  bodenAbtrag: n.bodenAbtrag,
                  wasserhaushalt: n.wasserhaushalt,
                  idealbiotopUebereinstimmung:
                    get(
                      n,
                      'tpopkontrIdbiotuebereinstWerteByIdealbiotopUebereinstimmung.text',
                    ) || null,
                  handlungsbedarf: n.handlungsbedarf,
                  flaecheUeberprueft: n.flaecheUeberprueft,
                  flaeche: n.flaeche,
                  planVorhanden: n.planVorhanden,
                  deckungVegetation: n.deckungVegetation,
                  deckungNackterBoden: n.deckungNackterBoden,
                  deckungApArt: n.deckungApArt,
                  jungpflanzenVorhanden: n.jungpflanzenVorhanden,
                  vegetationshoeheMaximum: n.vegetationshoeheMaximum,
                  vegetationshoeheMittel: n.vegetationshoeheMittel,
                  gefaehrdung: n.gefaehrdung,
                  changed: n.changed,
                  changedBy: n.changedBy,
                  apberNichtRelevant: n.apberNichtRelevant,
                  apberNichtRelevantGrund: n.apberNichtRelevantGrund,
                  ekfBemerkungen: n.ekfBemerkungen,
                  zaehlungen: (
                    get(n, 'tpopkontrzaehlsByTpopkontrId.nodes') || []
                  )
                    .map(
                      (n) =>
                        `Einheit: ${
                          get(n, 'tpopkontrzaehlEinheitWerteByEinheit.text') ||
                          '(keine)'
                        }, Methode: ${
                          get(n, 'tpopkontrzaehlMethodeWerteByMethode.text') ||
                          '(keine)'
                        }, Anzahl: ${n.anzahl || '(keine)'}`,
                    )
                    .join(' / '),
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
                fileName: 'Kontrollen',
                idKey: 'tpop_id',
                xKey: 'tpop_wgs84lat',
                yKey: 'tpop_wgs84long',
                store,
              })
            }}
          >
            {tpopkontrIsFiltered ? 'Kontrollen (gefiltert)' : 'Kontrollen'}
          </DownloadCardButton>
          <DownloadCardButton
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "KontrollenWebGisBun" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./allVTpopkontrWebgisbuns').then(
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
              const rows = get(result.data, 'allVTpopkontrWebgisbuns.nodes', [])
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
                fileName: 'KontrollenWebGisBun',
                idKey: 'TPOPGUID',
                xKey: 'KONTR_WGS84LAT',
                yKey: 'KONTR_WGS84LONG',
                store,
              })
            }}
          >
            Kontrollen für WebGIS BUN
          </DownloadCardButton>
          <DownloadCardButton
            onClick={async () => {
              const notif = enqueNotification({
                message: `Export "KontrollenAnzahlProZaehleinheit" wird vorbereitet...`,
                options: {
                  variant: 'info',
                  persist: true,
                },
              })
              let result
              try {
                result = await client.query({
                  query: await import('./allVKontrzaehlAnzproeinheits').then(
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
                'allVKontrzaehlAnzproeinheits.nodes',
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
                fileName: 'KontrollenAnzahlProZaehleinheit',
                idKey: 'tpop_id',
                xKey: 'tpop_wgs84lat',
                yKey: 'tpop_wgs84long',
                store,
              })
            }}
          >
            Kontrollen: Anzahl pro Zähleinheit
          </DownloadCardButton>
        </StyledCardContent>
      </Collapse>
    </StyledCard>
  )
}

export default observer(Kontrollen)
