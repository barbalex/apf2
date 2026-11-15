import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import Button from '@mui/material/Button'

import { rpc } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'
import { tableIsFiltered } from '../../../../modules/tableIsFiltered.ts'

import styles from '../index.module.css'

import {
  addNotificationAtom,
  treePopGqlFilterAtom,
} from '../../../../store/index.ts'
import { store } from '../../../../store/index.ts'

interface PopsProps {
  filtered?: boolean
}

export const Pops = ({ filtered = false }: PopsProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const popGqlFilter = useAtomValue(treePopGqlFilterAtom)

  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickPops = async () => {
    setQueryState('lade Daten...')
    let rows: Record<string, unknown>[] | undefined
    try {
      // joins, werte decodes and sorting happen in export_pop
      rows =
        (await rpc<Record<string, unknown>[]>(
          'export_pop',
          filtered ? { p_filter: popGqlFilter.filtered } : {},
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
      fileName: `Populationen${filtered ? '_gefiltert' : ''}`,
    })
    setQueryState(undefined)
  }

  const popIsFiltered = tableIsFiltered({ store, table: 'pop' })

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState || (filtered && !popIsFiltered)}
      onClick={() => void onClickPops()}
    >
      {filtered ? 'Populationen (gefiltert)' : 'Populationen'}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
