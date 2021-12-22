import React, { useContext, useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Icon from '@mui/material/Icon'
import { MdExpandMore as ExpandMoreIcon } from 'react-icons/md'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import { useSnackbar } from 'notistack'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import {
  StyledCardContent,
  CardActionTitle,
  StyledCard,
  StyledCardActions,
  CardActionIconButton,
  DownloadCardButton,
} from '../index'

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
    }) ??
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
          color="inherit"
        >
          <Icon title={expanded ? 'schliessen' : 'öffnen'}>
            <ExpandMoreIcon />
          </Icon>
        </CardActionIconButton>
      </StyledCardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {expanded ? (
          <StyledCardContent>
            <DownloadCardButton
              color="inherit"
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
                            createdAt
                            updatedAt
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
                const rows = (result.data?.allTpopkontrs?.nodes ?? []).map(
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
                      n?.tpopByTpopId?.popByPopId?.popStatusWerteByStatus
                        ?.text ?? null,
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
                    tpopBekanntSeit:
                      n?.optimizetpopByTpopId?.bekanntSeit ?? null,
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
                    tpopBewirtschaftung:
                      n?.tpopByTpopId?.bewirtschaftung ?? null,
                    tpopEkfrequenz: n?.tpopByTpopId?.ekfrequenz ?? null,
                    tpopEkfrequenzAbweichend:
                      n?.tpopByTpopId?.ekfrequenzAbweichend ?? null,
                    tpopEkfKontrolleur:
                      n?.tpopByTpopId?.adresseByEkfKontrolleur?.name ?? null,
                    id: n.id,
                    jahr: n.jahr,
                    datum: n.datum,
                    typ: n?.tpopkontrTypWerteByTyp?.text ?? null,
                    bearbeiter: n?.adresseByBearbeiter?.name ?? null,
                    ueberlebensrate: n.ueberlebensrate,
                    vitalitaet: n.vitalitaet,
                    entwicklung:
                      n?.tpopEntwicklungWerteByEntwicklung?.text ?? null,
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
                    idealbiotopUebereinstimmung:
                      n
                        ?.tpopkontrIdbiotuebereinstWerteByIdealbiotopUebereinstimmung
                        ?.text ?? null,
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
                    createdAt: n.createdAt,
                    updatedAt: n.updatedAt,
                    changedBy: n.changedBy,
                    apberNichtRelevant: n.apberNichtRelevant,
                    apberNichtRelevantGrund: n.apberNichtRelevantGrund,
                    ekfBemerkungen: n.ekfBemerkungen,
                    zaehlungen: (n?.tpopkontrzaehlsByTpopkontrId?.nodes ?? [])
                      .map(
                        (n) =>
                          `Einheit: ${
                            n?.tpopkontrzaehlEinheitWerteByEinheit?.text ??
                            '(keine)'
                          }, Methode: ${
                            n?.tpopkontrzaehlMethodeWerteByMethode?.text ??
                            '(keine)'
                          }, Anzahl: ${n.anzahl ?? '(keine)'}`,
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
              color="inherit"
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
                const rows = result.data?.allVTpopkontrWebgisbuns?.nodes ?? []
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
              color="inherit"
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
                const rows =
                  result.data?.allVKontrzaehlAnzproeinheits?.nodes ?? []
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
        ) : null}
      </Collapse>
    </StyledCard>
  )
}

export default observer(Kontrollen)
