import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'
import { tableIsFiltered } from '../../../../modules/tableIsFiltered.ts'

import type { ApId } from '../../../../models/apflora/public/ApId.ts'
import type { PopId } from '../../../../models/apflora/public/PopId.ts'
import type { TpopId } from '../../../../models/apflora/public/TpopId.ts'
import type { AdresseId } from '../../../../models/apflora/public/AdresseId.ts'

import styles from '../index.module.css'

import {
  addNotificationAtom,
  treeTpopGqlFilterAtom,
} from '../../../../store/index.ts'

interface TPopQueryResult {
  allTpops: {
    nodes: {
      popByPopId: {
        id: PopId
        apByApId: {
          id: ApId
          aeTaxonomyByArtId: {
            id: string
            artname: string | null
            familie: string | null
          } | null
          apBearbstandWerteByBearbeitung: {
            id: number
            text: string | null
          } | null
          startJahr: number | null
          apUmsetzungWerteByUmsetzung: {
            id: number
            text: string | null
          } | null
        } | null
        id: PopId
        nr: number | null
        name: string | null
        popStatusWerteByStatus: {
          id: number
          text: string | null
        } | null
        bekanntSeit: number | null
        statusUnklar: boolean | null
        statusUnklarBegruendung: string | null
        x: number | null
        y: number | null
      } | null
      id: TpopId
      nr: number | null
      gemeinde: string | null
      flurname: string | null
      status: number | null
      popStatusWerteByStatus: {
        id: number
        text: string | null
      } | null
      bekanntSeit: number | null
      statusUnklar: boolean | null
      statusUnklarGrund: string | null
      x: number | null
      y: number | null
      radius: number | null
      hoehe: number | null
      exposition: string | null
      klima: string | null
      neigung: string | null
      beschreibung: string | null
      katasterNr: string | null
      apberRelevant: number | null
      apberRelevantGrund: string | null
      eigentuemer: string | null
      kontakt: string | null
      nutzungszone: string | null
      bewirtschafter: string | null
      bewirtschaftung: string | null
      ekfrequenz: number | null
      ekfrequenzAbweichend: boolean | null
      adresseByEkfKontrolleur: {
        id: AdresseId
        name: string | null
      } | null
      createdAt: string | null
      updatedAt: string | null
      changedBy: string | null
    }[]
  }
}

interface TPopProps {
  filtered?: boolean
}

export const TPop = ({ filtered = false }: TPopProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const tpopGqlFilter = useAtomValue(treeTpopGqlFilterAtom)

  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const onClickTPop = async () => {
    setQueryState('lade Daten...')
    //console.time('querying')
    let result: { data: TPopQueryResult }
    try {
      result = await apolloClient.query({
        query: gql`
          query tpopForExportQuery($filter: TpopFilter) {
            allTpops(
              filter: $filter
              orderBy: [AP_NAME_ASC, POP_BY_POP_ID__NR_ASC, NR_ASC]
            ) {
              nodes {
                popByPopId {
                  id
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
                createdAt
                updatedAt
                changedBy
              }
            }
          }
        `,
        variables: {
          filter: filtered ? tpopGqlFilter.filtered : { or: [] },
          // seems to have no or little influence on ram usage:
        },
      })
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: { variant: 'error' },
      })
    }
    //console.timeEnd('querying')
    setQueryState('verarbeite...')
    //console.time('processing')
    const rows = (result.data?.allTpops?.nodes ?? []).map((n) => ({
      apId: n?.popByPopId?.apByApId?.id ?? null,
      apFamilie: n?.popByPopId?.apByApId?.aeTaxonomyByArtId?.familie ?? null,
      apArtname: n?.popByPopId?.apByApId?.aeTaxonomyByArtId?.artname ?? null,
      apBearbeitung:
        n?.popByPopId?.apByApId?.apBearbstandWerteByBearbeitung?.text ?? null,
      apStartJahr: n?.popByPopId?.apByApId?.startJahr ?? null,
      apUmsetzung:
        n?.popByPopId?.apByApId?.apUmsetzungWerteByUmsetzung?.text ?? null,
      popId: n?.popByPopId?.id ?? null,
      popNr: n?.popByPopId?.nr ?? null,
      popName: n?.popByPopId?.name ?? null,
      popStatus: n?.popByPopId?.popStatusWerteByStatus?.text ?? null,
      popBekanntSeit: n?.popByPopId?.bekanntSeit ?? null,
      popStatusUnklar: n?.popByPopId?.statusUnklar ?? null,
      popStatusUnklarBegruendung:
        n?.popByPopId?.statusUnklarBegruendung ?? null,
      popX: n?.popByPopId?.x ?? null,
      popY: n?.popByPopId?.y ?? null,
      id: n.id,
      nr: n.nr,
      gemeinde: n.gemeinde,
      flurname: n.flurname,
      status: n.status,
      statusDecodiert: n?.popStatusWerteByStatus?.text ?? null,
      bekanntSeit: n.bekanntSeit,
      statusUnklar: n.statusUnklar,
      statusUnklarGrund: n.statusUnklarGrund,
      x: n.x,
      y: n.y,
      radius: n.radius,
      hoehe: n.hoehe,
      exposition: n.exposition,
      klima: n.klima,
      neigung: n.neigung,
      beschreibung: n.beschreibung,
      katasterNr: n.katasterNr,
      apberRelevant: n.apberRelevant,
      apberRelevantGrund: n.apberRelevantGrund,
      eigentuemer: n.eigentuemer,
      kontakt: n.kontakt,
      nutzungszone: n.nutzungszone,
      bewirtschafter: n.bewirtschafter,
      bewirtschaftung: n.bewirtschaftung,
      ekfrequenz: n.ekfrequenz,
      ekfrequenzAbweichend: n.ekfrequenzAbweichend,
      ekfKontrolleur: n?.adresseByEkfKontrolleur?.name ?? null,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
      changedBy: n.changedBy,
    }))
    const enrichedData = rows.map((oWithout) => {
      let o = { ...oWithout }
      let nachBeginnAp = null
      if (
        o.apStartJahr &&
        o.bekanntSeit &&
        [200, 201, 202].includes(o.status)
      ) {
        if (o.apStartJahr <= o.bekanntSeit) {
          nachBeginnAp = true
        } else {
          nachBeginnAp = false
        }
      }
      o.angesiedeltNachBeginnAp = nachBeginnAp
      return o
    })
    //console.timeEnd('processing')
    //console.time('exporting')
    if (rows.length === 0) {
      setQueryState(undefined)
      return addNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    await exportModule({
      data: enrichedData,
      fileName: 'Teilpopulationen',
    })
    setQueryState(undefined)
    //console.timeEnd('exporting')
  }

  const tpopIsFiltered = tableIsFiltered({ table: 'tpop' })

  return (
    <Button
      className={styles.button}
      onClick={onClickTPop}
      color="inherit"
      disabled={!!queryState || (filtered && !tpopIsFiltered)}
    >
      {filtered ? 'Teilpopulationen (gefiltert)' : 'Teilpopulationen'}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
