import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

export const AnzKontrProPop = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickAnzKontrProPop = async () => {
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
          anzahl_kontrollen: number | null
        }[]
      | undefined
    try {
      nodes =
        (await apiFetch<NonNullable<typeof nodes>>(
          `/v_pop_anzkontr?select=ap_id,artname,ap_bearbeitung,ap_start_jahr,ap_umsetzung,id,nr,name,status,bekannt_seit,status_unklar,status_unklar_begruendung,x,y,anzahl_kontrollen`,
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
      x: z.x ?? '',
      y: z.y ?? '',
      anzahl_kontrollen: z.anzahl_kontrollen ?? '',
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
      fileName: 'PopulationenAnzahlKontrollen',
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={() => void onClickAnzKontrProPop()}
    >
      Anzahl Kontrollen pro Population
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
