import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'
import { tableIsFiltered } from '../../../../modules/tableIsFiltered.ts'

import {
  ApId,
  PopId,
  TpopId,
  TpopmassnId,
  AdresseId,
} from '../../../../models/apflora/index.tsx'

import styles from '../index.module.css'

import {
  addNotificationAtom,
  treeTpopmassnGqlFilterAtom,
} from '../../../../store/index.ts'

interface TpopmassnQueryResult {
  allTpopmassns: {
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
        katasterNr?: string
        apberRelevant?: number
        apberRelevantGrund?: number
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
      id: TpopmassnId
      jahr?: number
      datum?: string
      tpopmassnTypWerteByTyp?: {
        id: number
        text?: string
      }
      beschreibung?: string
      adresseByBearbeiter?: {
        id: AdresseId
        name?: string
      }
      bemerkungen?: string
      planVorhanden?: boolean
      planBezeichnung?: string
      flaeche?: number
      form?: string
      pflanzanordnung?: string
      markierung?: string
      anzTriebe?: number
      anzPflanzen?: number
      anzPflanzstellen?: number
      tpopkontrzaehlEinheitWerteByZieleinheitEinheit?: {
        id: number
        text?: string
      }
      zieleinheitAnzahl?: number
      wirtspflanze?: string
      herkunftPop?: string
      sammeldatum?: string
      vonAnzahlIndividuen?: number
      createdAt?: string
      updatedAt?: string
      changedBy?: string
    }>
  }
}

interface MassnahmenProps {
  filtered?: boolean
}

export const Massnahmen = ({ filtered = false }: MassnahmenProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const tpopmassnGqlFilter = useAtomValue(treeTpopmassnGqlFilterAtom)

  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const tpopmassnIsFiltered = tableIsFiltered({ table: 'tpopmassn' })

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState || (filtered && !tpopmassnIsFiltered)}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result: { data?: TpopmassnQueryResult }
        try {
          result = await apolloClient.query<TpopmassnQueryResult>({
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
                    createdAt
                    updatedAt
                    changedBy
                  }
                }
              }
            `,
            variables: {
              filter: filtered ? tpopmassnGqlFilter.filtered : { or: [] },
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
        const rows = (result?.data?.allTpopmassns.nodes ?? []).map((n) => ({
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
          tpopBekanntSeit: n?.tpopByTpopId?.bekanntSeit ?? null,
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
            n?.tpopkontrzaehlEinheitWerteByZieleinheitEinheit?.text ?? null,
          zieleinheitAnzahl: n.zieleinheitAnzahl,
          wirtspflanze: n.wirtspflanze,
          herkunftPop: n.herkunftPop,
          sammeldatum: n.sammeldatum,
          vonAnzahlIndividuen: n.vonAnzahlIndividuen,
          createdAt: n.createdAt,
          updatedAt: n.updatedAt,
          changedBy: n.changedBy,
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
          fileName: 'Massnahmen',
        })
        setQueryState(undefined)
      }}
    >
      {filtered ? 'Massnahmen (gefiltert)' : 'Massnahmen'}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
