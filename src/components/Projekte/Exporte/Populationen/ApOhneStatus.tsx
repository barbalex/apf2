import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

export const ApOhneStatus = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickApOhneStatus = async () => {
    setQueryState('lade Daten...')
    let nodes:
      | {
          ap_id: string | null
          artname: string | null
          ap_bearbeitung: string | null
          id: string
          nr: number | null
          name: string | null
          status: string | null
          x: number | null
          y: number | null
        }[]
      | undefined
    try {
      nodes =
        (await apiFetch<NonNullable<typeof nodes>>(
          `/v_pop_vonapohnestatus?select=ap_id,artname,ap_bearbeitung,id,nr,name,status,x,y`,
        )) ?? []
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    setQueryState('verarbeite...')
    const rows = (nodes ?? []).map((z) => ({
      ap_id: z.ap_id ?? '',
      artname: z.artname ?? '',
      ap_bearbeitung: z.ap_bearbeitung ?? '',
      id: z.id ?? '',
      nr: z.nr ?? '',
      name: z.name ?? '',
      status: z.status ?? '',
      lv95X: z.x ?? '',
      lv95Y: z.y ?? '',
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
    void exportModule({
      data: sortBy(rows, ['artname', 'nr']),
      fileName: 'PopulationenVonApArtenOhneStatus',
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={() => void onClickApOhneStatus()}
    >
      Populationen von AP-Arten ohne Status
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
