import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker'

import {
  ekPlanHoveredAtom,
  ekPlanSetHoveredTpopIdAtom,
  ekPlanResetHoveredAtom,
  ekPlanApValuesAtom,
} from '../../../../store/index.ts'

import indexStyles from '../index.module.css'
import styles from './index.module.css'

const processChangeWorkerFactory = createWorkerFactory(
  () => import('./processChange.ts'),
)

export const CellForEkfrequenz = ({
  row,
  isOdd,
  field,
  width,
  setProcessing,
  data,
}) => {
  const hovered = useAtomValue(ekPlanHoveredAtom)
  const setHoveredTpopId = useSetAtom(ekPlanSetHoveredTpopIdAtom)
  const resetHovered = useSetAtom(ekPlanResetHoveredAtom)
  const apValues = useAtomValue(ekPlanApValuesAtom)

  const processChangeWorker = useWorker(processChangeWorkerFactory)

  const allEkfrequenzs = data?.allEkfrequenzs?.nodes ?? []

  const maxCodeLength = Math.max(
    ...allEkfrequenzs.map((a) => (a.code || '').length),
  )

  const onMouseEnter = () => setHoveredTpopId(row.id)

  const onChange = async (e) => {
    const value = e.target.value || null
    setProcessing(true)
    await processChangeWorker.processChange({
      value,
      row,
    })
    setProcessing(false)
  }

  const valueToShow = allEkfrequenzs?.find((e) => e.id === field.value)?.code

  const [open, setOpen] = useState(false)
  const onOpen = () => setOpen(true)
  const onClose = () => setOpen(false)

  const isHovered = hovered.tpopId === row.id
  const cellStyle = {
    maxWidth: width,
    minWidth: width,
    backgroundColor:
      isHovered ? 'hsla(45, 100%, 90%, 1)'
      : isOdd ? 'rgb(255, 255, 252)'
      : 'unset',
  }

  return (
    <>
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={resetHovered}
        onClick={onOpen}
        className={indexStyles.cellForSelect}
        style={cellStyle}
      >
        {valueToShow}
      </div>
      <Dialog
        onClose={onClose}
        open={open}
      >
        <DialogTitle className={styles.dialogTitle}>
          EK-Frequenz wählen:
        </DialogTitle>
        <List sx={{ pt: 0 }}>
          <ListItem
            onClick={() => {
              onChange({ target: { value: '' } })
              onClose()
            }}
            button={true.toString()}
            dense
            style={{
              ...(data?.tpopById?.ekfrequenz === null ?
                { backgroundColor: 'rgba(0, 0, 0, 0.06)' }
              : {}),
            }}
            className={styles.listItem}
          >
            Kein Wert
          </ListItem>
          {allEkfrequenzs.map((e) => (
            <ListItem
              key={e.id}
              onClick={() => {
                onChange({ target: { value: e.id } })
                onClose()
              }}
              button={true.toString()}
              dense
              style={{
                ...(e.id === data?.tpopById?.ekfrequenz ?
                  { backgroundColor: 'rgba(0, 0, 0, 0.06)' }
                : {}),
              }}
              className={styles.listItem}
            >
              <span
                className={styles.codeText}
                width={maxCodeLength}
                style={{ minWidth: `${maxCodeLength * 0.65}rem` }}
              >
                {e.code}
              </span>
              <span className={styles.anwendungsfallText}>
                {e.anwendungsfall}
              </span>
            </ListItem>
          ))}
        </List>
      </Dialog>
    </>
  )
}
