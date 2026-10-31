import { useState } from 'react'
import { useSetAtom } from 'jotai'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

export const EkPlanung = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickEkPlanung = async () => {
    setQueryState('lade Daten...')
    let nodes:
      | {
          ap_id: string | null
          artname: string | null
          artverantwortlich: string | null
          jahr: number | null
          a: number | null
          b: number | null
          d: number | null
          ekf: number | null
        }[]
      | undefined
    try {
      nodes =
        (await apiFetch<NonNullable<typeof nodes>>(
          `/v_ek_planung_nach_abrechnungstyp?select=ap_id,artname,artverantwortlich,jahr,a,b,d,ekf`,
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
      ap_id: z.ap_id,
      artname: z.artname ?? '',
      artverantwortlich: z.artverantwortlich ?? '',
      jahr: z.jahr ?? '',
      a: z.a ?? 0,
      b: z.b ?? 0,
      d: z.d ?? 0,
      ekf: z.ekf ?? 0,
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
      data: rows,
      fileName: 'EkPlanungProJahrNachAbrechnungstyp',
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={() => void onClickEkPlanung()}
      color="inherit"
      disabled={!!queryState}
    >
      EK-Planung pro Jahr nach Abrechnungstyp
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
