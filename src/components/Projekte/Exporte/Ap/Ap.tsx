import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import Button from '@mui/material/Button'

import { rpc } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'
import { tableIsFiltered } from '../../../../modules/tableIsFiltered.ts'

import styles from '../index.module.css'

import {
  addNotificationAtom,
  treeApGqlFilterAtom,
} from '../../../../store/index.ts'
import { store } from '../../../../store/index.ts'

interface ApProps {
  filtered?: boolean
}

export const Ap = ({ filtered = false }: ApProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apGqlFilter = useAtomValue(treeApGqlFilterAtom)

  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickAp = async () => {
    setQueryState('lade Daten...')
    let rows: Record<string, unknown>[] | undefined
    try {
      // werte decodes, av name/email and sorting happen in export_ap
      rows =
        (await rpc<Record<string, unknown>[]>(
          'export_ap',
          filtered ? { p_filter: apGqlFilter.filtered } : {},
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
      fileName: `Arten${filtered ? '_gefiltert' : ''}`,
    })
    setQueryState(undefined)
  }

  const apIsFiltered = tableIsFiltered({ store, table: 'ap' })

  return (
    <Button
      className={styles.button}
      onClick={() => void onClickAp()}
      color="inherit"
      disabled={!!queryState || (filtered && !apIsFiltered)}
    >
      {filtered ? 'Arten (gefiltert)' : 'Arten'}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
