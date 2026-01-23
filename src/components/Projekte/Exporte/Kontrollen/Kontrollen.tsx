import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import {
  ApId,
  PopId,
  TpopId,
  TpopkontrId,
  AdresseId,
  TpopkontrzaehlId,
} from '../../../../models/apflora/index.tsx'

import styles from '../index.module.css'

import {
  addNotificationAtom,
  treeTpopkontrGqlFilterAtom,
} from '../../../../store/index.ts'

interface TpopkontrQueryResult {
  allTpopkontrs: {
    nodes: Array<{
      tpopByTpopId?: {
        popByPopId?: {
          apByApId?: {
            id: ApId
            aeTaxonomyByArtId?: {
              id: string
              artname?: string
              familie?: string
            }
            apBearbstandWerteByBearbeitung?: {
              id: number
              text?: string
            }
            startJahr?: number
            apUmsetzungWerteByUmsetzung?: {
              id: number
              text?: string
            }
          }
          id: PopId
          nr?: number
          name?: string
          popStatusWerteByStatus?: {
            id: number
            text?: string
          }
          bekanntSeit?: number
          statusUnklar?: boolean
          statusUnklarBegruendung?: string
          x?: number
          y?: number
        }
        id: TpopId
        nr?: number
        gemeinde?: string
        flurname?: string
        status?: number
        popStatusWerteByStatus?: {
          id: number
          text?: string
        }
        bekanntSeit?: number
        statusUnklar?: boolean
        statusUnklarGrund?: string
        x?: number
        y?: number
        radius?: number
        hoehe?: number
        exposition?: string
        klima?: string
        neigung?: string
        beschreibung?: string
        kataster_nr?: string
        apber_relevant?: number
        apber_relevant_grund?: number
        eigentuemer?: string
        kontakt?: string
        nutzungszone?: string
        bewirtschafter?: string
        bewirtschaftung?: string
        ekfrequenz?: string
        ekfrequenzAbweichend?: boolean
        adresseByEkfKontrolleur?: {
          id: AdresseId
          name?: string
        }
      }
      id: TpopkontrId
      jahr?: number
      datum?: string
      tpopkontrTypWerteByTyp?: {
        id: number
        text?: string
      }
      adresseByBearbeiter?: {
        id: AdresseId
        name?: string
      }
      ueberlebensrate?: number
      vitalitaet?: string
      tpopEntwicklungWerteByEntwicklung?: {
        id: number
        text?: string
      }
      ursachen?: string
      erfolgsbeurteilung?: string
      umsetzungAendern?: string
      kontrolleAendern?: string
      bemerkungen?: string
      lrDelarze?: string
      lrUmgebungDelarze?: string
      vegetationstyp?: string
      konkurrenz?: string
      moosschicht?: string
      krautschicht?: string
      strauchschicht?: string
      baumschicht?: string
      tpopkontrIdbiotuebereinstWerteByIdealbiotopUebereinstimmung?: {
        id: number
        text?: string
      }
      handlungsbedarf?: string
      flaecheUeberprueft?: number
      flaeche?: number
      planVorhanden?: boolean
      deckungVegetation?: number
      deckungNackterBoden?: number
      deckungApArt?: number
      jungpflanzenVorhanden?: boolean
      vegetationshoeheMaximum?: number
      vegetationshoeheMittel?: number
      gefaehrdung?: string
      createdAt?: string
      updatedAt?: string
      changedBy?: string
      apberNichtRelevant?: boolean
      apberNichtRelevantGrund?: string
      ekfBemerkungen?: string
      tpopkontrzaehlsByTpopkontrId?: {
        nodes: Array<{
          id: TpopkontrzaehlId
          anzahl?: number
          tpopkontrzaehlEinheitWerteByEinheit?: {
            id: number
            text?: string
          }
          tpopkontrzaehlMethodeWerteByMethode?: {
            id: number
            text?: string
          }
        }>
      }
    }>
  }
}

interface KontrollenProps {
  filtered?: boolean
}

export const Kontrollen = ({ filtered = false }: KontrollenProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const tpopkontrGqlFilter = useAtomValue(treeTpopkontrGqlFilterAtom)

  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result: { data?: TpopkontrQueryResult }
        try {
          result = await apolloClient.query<TpopkontrQueryResult>({
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
              filter: filtered ? tpopkontrGqlFilter : { or: [] },
            },
          })
        } catch (error) {
          addNotification({
            message: (error as Error).message,
            options: {
              variant: 'error',
            },
          })
        }
        setQueryState('verarbeite...')
        const rows = (result.data?.allTpopkontrs?.nodes ?? []).map((n) => ({
          apId: n?.tpopByTpopId?.popByPopId?.apByApId?.id ?? null,
          apFamilie:
            n?.tpopByTpopId?.popByPopId?.apByApId?.aeTaxonomyByArtId?.familie ??
            null,
          apArtname:
            n?.tpopByTpopId?.popByPopId?.apByApId?.aeTaxonomyByArtId?.artname ??
            null,
          apBearbeitung:
            n?.tpopByTpopId?.popByPopId?.apByApId
              ?.apBearbstandWerteByBearbeitung?.text ?? null,
          apStartJahr: n?.tpopByTpopId?.popByPopId?.apByApId?.startJahr ?? null,
          apUmsetzung:
            n?.tpopByTpopId?.popByPopId?.apByApId?.apUmsetzungWerteByUmsetzung
              ?.text ?? null,
          popId: n?.tpopByTpopId?.popByPopId?.id ?? null,
          popNr: n?.tpopByTpopId?.popByPopId?.nr ?? null,
          popName: n?.tpopByTpopId?.popByPopId?.name ?? null,
          popStatus:
            n?.tpopByTpopId?.popByPopId?.popStatusWerteByStatus?.text ?? null,
          popBekanntSeit: n?.tpopByTpopId?.popByPopId?.bekanntSeit ?? null,
          popStatusUnklar: n?.tpopByTpopId?.popByPopId?.statusUnklar ?? null,
          popStatusUnklarBegruendung:
            n?.tpopByTpopId?.popByPopId?.statusUnklarBegruendung ?? null,
          popX: n?.tpopByTpopId?.popByPopId?.x ?? null,
          popY: n?.tpopByTpopId?.popByPopId?.y ?? null,
          tpopId: n?.tpopByTpopId?.id ?? null,
          tpopNr: n?.tpopByTpopId?.nr ?? null,
          tpopGemeinde: n?.tpopByTpopId?.gemeinde ?? null,
          tpopFlurname: n?.tpopByTpopId?.flurname ?? null,
          tpopStatus: n?.tpopByTpopId?.status ?? null,
          statusDecodiert:
            n?.tpopByTpopId?.popStatusWerteByStatus?.text ?? null,
          tpopBekanntSeit: n?.optimizetpopByTpopId?.bekanntSeit ?? null,
          tpopStatusUnklar: n?.tpopByTpopId?.statusUnklar ?? null,
          tpopStatusUnklarGrund: n?.tpopByTpopId?.statusUnklarGrund ?? null,
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
          tpopApberRelevantGrund: n?.tpopByTpopId?.apberRelevantGrund ?? null,
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
          typ: n?.tpopkontrTypWerteByTyp?.text ?? null,
          bearbeiter: n?.adresseByBearbeiter?.name ?? null,
          ueberlebensrate: n.ueberlebensrate,
          vitalitaet: n.vitalitaet,
          entwicklung: n?.tpopEntwicklungWerteByEntwicklung?.text ?? null,
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
            n?.tpopkontrIdbiotuebereinstWerteByIdealbiotopUebereinstimmung
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
                  n?.tpopkontrzaehlEinheitWerteByEinheit?.text ?? '(keine)'
                }, Methode: ${
                  n?.tpopkontrzaehlMethodeWerteByMethode?.text ?? '(keine)'
                }, Anzahl: ${n.anzahl ?? '(keine)'}`,
            )
            .join(' / '),
        }))
        if (rows.length === 0) {
          setQueryState(undefined)
          return addNotification({
            message: 'Die Abfrage retournierte 0 Datensätze',
            options: {
              variant: 'warning',
            },
          })
        }
        exportModule({
          data: rows,
          fileName: 'Kontrollen',
        })
        setQueryState(undefined)
      }}
    >
      {filtered ? 'Kontrollen (gefiltert)' : 'Kontrollen'}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
