import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import Button from '@mui/material/Button'

import { rpc } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'
import { tableIsFiltered } from '../../../../modules/tableIsFiltered.ts'

import styles from '../index.module.css'

import {
  addNotificationAtom,
  treeTpopmassnGqlFilterAtom,
} from '../../../../store/index.ts'
import { store } from '../../../../store/index.ts'

interface MassnahmenProps {
  filtered?: boolean
}

export const Massnahmen = ({ filtered = false }: MassnahmenProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const tpopmassnGqlFilter = useAtomValue(treeTpopmassnGqlFilterAtom)

  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickMassnahmen = async () => {
    setQueryState('lade Daten...')
    let rows: Record<string, unknown>[] | undefined
    try {
      // joins, werte decodes and sorting happen in export_tpopmassn
      rows =
        (await rpc<Record<string, unknown>[]>(
          'export_tpopmassn',
          filtered ? { p_filter: tpopmassnGqlFilter.filtered } : {},
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
      fileName: 'Massnahmen',
    })
    setQueryState(undefined)
  }

  const tpopmassnIsFiltered = tableIsFiltered({ store, table: 'tpopmassn' })

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState || (filtered && !tpopmassnIsFiltered)}
      onClick={() => void onClickMassnahmen()}
    >
      {filtered ? 'Massnahmen (gefiltert)' : 'Massnahmen'}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
