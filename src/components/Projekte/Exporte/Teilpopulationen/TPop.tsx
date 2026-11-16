import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import Button from '@mui/material/Button'

import { rpc } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'
import { tableIsFiltered } from '../../../../modules/tableIsFiltered.ts'

import styles from '../index.module.css'

import {
  addNotificationAtom,
  treeTpopGqlFilterAtom,
} from '../../../../store/index.ts'
import { store } from '../../../../store/index.ts'

interface TPopProps {
  filtered?: boolean
}

export const TPop = ({ filtered = false }: TPopProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const tpopGqlFilter = useAtomValue(treeTpopGqlFilterAtom)

  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickTPop = async () => {
    setQueryState('lade Daten...')
    let rows: Record<string, unknown>[] | undefined
    try {
      // joins, werte decodes, angesiedeltNachBeginnAp and sorting
      // happen in export_tpop
      rows =
        (await rpc<Record<string, unknown>[]>(
          'export_tpop',
          filtered ? { p_filter: tpopGqlFilter.filtered } : {},
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
    await exportModule({
      data: rows,
      fileName: 'Teilpopulationen',
    })
    setQueryState(undefined)
  }

  const tpopIsFiltered = tableIsFiltered({ store, table: 'tpop' })

  return (
    <Button
      className={styles.button}
      onClick={() => void onClickTPop()}
      color="inherit"
      disabled={!!queryState || (filtered && !tpopIsFiltered)}
    >
      {filtered ? 'Teilpopulationen (gefiltert)' : 'Teilpopulationen'}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
