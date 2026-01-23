import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import type { TpopId } from '../../../../models/apflora/public/TpopId.ts'

import styles from '../index.module.css'

import {
  addNotificationAtom,
} from '../../../../JotaiStore/index.ts'


interface TPopWebgisBunQueryResult {
  allVTpopWebgisbuns: {
    nodes: {
      APARTID: string | null
      APART: string | null
      APSTATUS: string | null
      APSTARTJAHR: number | null
      APSTANDUMSETZUNG: string | null
      POPGUID: string | null
      POPNR: number | null
      POPNAME: string | null
      POPSTATUS: string | null
      POPSTATUSUNKLAR: boolean | null
      POPUNKLARGRUND: string | null
      POPBEKANNTSEIT: number | null
      POP_X: number | null
      POP_Y: number | null
      TPOPID: TpopId
      TPOPGUID: string | null
      TPOPNR: number | null
      TPOPGEMEINDE: string | null
      TPOPFLURNAME: string | null
      TPOPSTATUS: string | null
      tpopapberrelevant: number | null
      tpopapberrelevantgrund: string | null
      TPOPSTATUSUNKLAR: boolean | null
      TPOPUNKLARGRUND: string | null
      TPOP_X: number | null
      TPOP_Y: number | null
      TPOPRADIUS: number | null
      TPOPHOEHE: number | null
      TPOPEXPOSITION: string | null
      TPOPKLIMA: string | null
      TPOPHANGNEIGUNG: string | null
      TPOPBESCHREIBUNG: string | null
      TPOPKATASTERNR: string | null
      TPOPVERANTWORTLICH: string | null
      TPOPBERICHTSRELEVANZ: string | null
      TPOPBEKANNTSEIT: number | null
      TPOPEIGENTUEMERIN: string | null
      TPOPKONTAKTVO: string | null
      TPOPNUTZUNGSZONE: string | null
      TPOPBEWIRTSCHAFTER: string | null
      TPOPBEWIRTSCHAFTUNG: string | null
      TPOPCHANGEDAT: string | null
      TPOPCHANGEBY: string | null
    }[]
  }
}

export const TPopFuerWebgisBun = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result: { data: TPopWebgisBunQueryResult }
        try {
          result = await apolloClient.query({
            query: gql`
              query viewTpopWebgisbuns {
                allVTpopWebgisbuns {
                  nodes {
                    APARTID: apartid
                    APART: apart
                    APSTATUS: apstatus
                    APSTARTJAHR: apstartjahr
                    APSTANDUMSETZUNG: apstandumsetzung
                    POPGUID: popguid
                    POPNR: popnr
                    POPNAME: popname
                    POPSTATUS: popstatus
                    POPSTATUSUNKLAR: popstatusunklar
                    POPUNKLARGRUND: popunklargrund
                    POPBEKANNTSEIT: popbekanntseit
                    POP_X: popX
                    POP_Y: popY
                    TPOPID: tpopid
                    TPOPGUID: tpopguid
                    TPOPNR: tpopnr
                    TPOPGEMEINDE: tpopgemeinde
                    TPOPFLURNAME: tpopflurname
                    TPOPSTATUS: tpopstatus
                    tpopapberrelevant: tPopApberRelevant
                    tpopapberrelevantgrund: tPopApberRelevantGrund
                    TPOPSTATUSUNKLAR: tpopstatusunklar
                    TPOPUNKLARGRUND: tpopunklargrund
                    TPOP_X: tpopX
                    TPOP_Y: tpopY
                    TPOPRADIUS: tpopradius
                    TPOPHOEHE: tpophoehe
                    TPOPEXPOSITION: tpopexposition
                    TPOPKLIMA: tpopklima
                    TPOPHANGNEIGUNG: tpophangneigung
                    TPOPBESCHREIBUNG: tpopbeschreibung
                    TPOPKATASTERNR: tpopkatasternr
                    TPOPVERANTWORTLICH: tpopverantwortlich
                    TPOPBERICHTSRELEVANZ: tpopberichtsrelevanz
                    TPOPBEKANNTSEIT: tpopbekanntseit
                    TPOPEIGENTUEMERIN: tpopeigentuemerin
                    TPOPKONTAKTVO: tpopkontaktVo
                    TPOPNUTZUNGSZONE: tpopNutzungszone
                    TPOPBEWIRTSCHAFTER: tpopbewirtschafter
                    TPOPBEWIRTSCHAFTUNG: tpopbewirtschaftung
                    TPOPCHANGEDAT: tpopchangedat
                    TPOPCHANGEBY: tpopchangeby
                  }
                }
              }
            `,
          })
        } catch (error) {
          addNotification({
            message: (error as Error).message,
            options: { variant: 'error' },
          })
        }
        setQueryState('verarbeite...')
        const rows = result.data?.allVTpopWebgisbuns?.nodes ?? []
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
          fileName: 'TeilpopulationenWebGisBun',
        })
        setQueryState(undefined)
      }}
    >
      Teilpopulationen für WebGIS BUN
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
