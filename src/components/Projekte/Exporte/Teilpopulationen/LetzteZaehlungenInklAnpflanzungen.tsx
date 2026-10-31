import { useState } from 'react'
import { useSetAtom } from 'jotai'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

export const LetzteZaehlungenInklAnpflanzungen = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickLetzteZaehlungenInklAnpflanzungen = async () => {
    setQueryState('lade Daten...')
    let rows: Record<string, unknown>[] = []
    try {
      rows =
        (await apiFetch<Record<string, unknown>[]>(
          `/v_tpop_last_count_with_massn?select=*`,
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
      fileName: 'TPopLetzteZaehlungenInklMassn',
      idKey: 'pop_id',
    } as Parameters<typeof exportModule>[0])
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={() => void onClickLetzteZaehlungenInklAnpflanzungen()}
    >
      Aktuellste Zählung inklusive seither erfolgter Anpflanzungen
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
