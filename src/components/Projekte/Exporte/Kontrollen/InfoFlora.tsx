import { useState } from 'react'
import { useSetAtom } from 'jotai'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

export const InfoFlora = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickInfoFlora = async () => {
    setQueryState('lade Daten...')
    let nodes: Record<string, unknown>[] = []
    try {
      nodes =
        (await apiFetch<Record<string, unknown>[]>(
          `/v_export_info_flora_beob?select=*`,
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
    void exportModule({
      data: nodes,
      fileName: 'KontrollenApFloraZhFuerInfoFlora',
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={() => void onClickInfoFlora()}
      color="inherit"
      disabled={!!queryState}
    >
      Kontrollen als Beobachtungen für Info Flora
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
