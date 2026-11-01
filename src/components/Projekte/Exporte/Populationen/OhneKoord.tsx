import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

export const OhneKoord = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickOhneKoord = async () => {
    setQueryState('lade Daten...')
    let nodes:
      | {
          ap_id: string | null
          artname: string | null
          ap_bearbeitung: string | null
          ap_start_jahr: number | null
          ap_umsetzung: string | null
          id: string
          nr: number | null
          name: string | null
          status: string | null
          bekannt_seit: number | null
          status_unklar: boolean | null
          status_unklar_begruendung: string | null
          x: number | null
          y: number | null
          created_at: string | null
          updated_at: string | null
          changed_by: string | null
        }[]
      | undefined
    try {
      nodes =
        (await apiFetch<NonNullable<typeof nodes>>(
          `/v_pop_ohnekoord?select=ap_id,artname,ap_bearbeitung,ap_start_jahr,ap_umsetzung,id,nr,name,status,bekannt_seit,status_unklar,status_unklar_begruendung,x,y,created_at,updated_at,changed_by`,
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
      ap_start_jahr: z.ap_start_jahr ?? '',
      ap_umsetzung: z.ap_umsetzung ?? '',
      id: z.id ?? '',
      nr: z.nr ?? '',
      name: z.name ?? '',
      status: z.status ?? '',
      bekannt_seit: z.bekannt_seit ?? '',
      status_unklar: z.status_unklar ?? '',
      status_unklar_begruendung: z.status_unklar_begruendung ?? '',
      lv95X: z.x ?? '',
      lv95Y: z.y ?? '',
      created_at: z.created_at ?? '',
      updated_at: z.updated_at ?? '',
      changed_by: z.changed_by ?? '',
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
      fileName: 'PopulationenOhneKoordinaten',
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={() => void onClickOhneKoord()}
    >
      Populationen ohne Koordinaten
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
