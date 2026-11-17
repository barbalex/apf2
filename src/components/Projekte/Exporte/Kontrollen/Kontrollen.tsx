import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import Button from '@mui/material/Button'

import { rpc } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'

import styles from '../index.module.css'

import {
  addNotificationAtom,
  treeTpopkontrGqlFilterAtom,
} from '../../../../store/index.ts'

interface KontrollenProps {
  filtered?: boolean
}

export const Kontrollen = ({ filtered = false }: KontrollenProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const tpopkontrGqlFilter = useAtomValue(treeTpopkontrGqlFilterAtom)

  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickKontrollen = async () => {
    setQueryState('lade Daten...')
    let rows: Record<string, unknown>[] | undefined
    try {
      // joins, werte decodes, zaehlungen and sorting happen in export_tpopkontr
      rows =
        (await rpc<Record<string, unknown>[]>(
          'export_tpopkontr',
          filtered ? { p_filter: tpopkontrGqlFilter } : {},
        )) ?? []
    } catch (error) {
      setQueryState(undefined)
      return addNotification({
        message: (error as Error).message,
        options: { variant: 'error' },
      })
    }
    if (rows.length === 0) {
      setQueryState(undefined)
      return addNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: { variant: 'warning' },
      })
    }
    void exportModule({
      data: rows,
      fileName: 'Kontrollen',
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={() => void onClickKontrollen()}
    >
      {filtered ? 'Kontrollen (gefiltert)' : 'Kontrollen'}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
