import { useState } from 'react'
import { useSetAtom } from 'jotai'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

export const MassnWebgisBun = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickMassnWebgisBun = async () => {
    setQueryState('lade Daten...')
    let nodes: Record<string, unknown>[] = []
    try {
      nodes =
        (await apiFetch<Record<string, unknown>[]>(
          `/v_massn_webgisbun?select=*`,
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
    if (nodes.length === 0) {
      setQueryState(undefined)
      return addNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    void exportModule({ data: nodes, fileName: 'MassnahmenWebGisBun' })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={() => void onClickMassnWebgisBun()}
    >
      Massnahmen für WebGIS BUN
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
