import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import {
  ekPlanHoveredAtom,
  ekPlanSetHoveredTpopIdAtom,
  ekPlanResetHoveredAtom,
} from '../../../../store/index.ts'
import { processChange } from './processChange.ts'
import type { EkfrequenzId } from '../../../../models/apflora/Ekfrequenz.ts'
import type { TpopRow } from '../tableTypes.ts'

import styles from './index.module.css'

export const CellForEkfrequenzStartjahr = ({
  row,
  isOdd,
  width,
  setProcessing,
  ekfrequenzStartjahr,
  ekfrequenz,
}: {
  row: TpopRow
  isOdd: boolean
  width: number | undefined
  setProcessing: (processing: boolean) => void
  ekfrequenzStartjahr: number | null | undefined
  ekfrequenz: EkfrequenzId | null | undefined
}) => {
  const hovered = useAtomValue(ekPlanHoveredAtom)
  const setHoveredTpopId = useSetAtom(ekPlanSetHoveredTpopIdAtom)
  const resetHovered = useSetAtom(ekPlanResetHoveredAtom)
  const isHovered = hovered.tpopId === row.id

  const [stateValue, setStateValue] = useState(ekfrequenzStartjahr ?? '')
  const [prevEkfrequenzStartjahr, setPrevEkfrequenzStartjahr] = useState(
    ekfrequenzStartjahr,
  )
  if (prevEkfrequenzStartjahr !== ekfrequenzStartjahr) {
    setPrevEkfrequenzStartjahr(ekfrequenzStartjahr)
    setStateValue(ekfrequenzStartjahr ?? '')
  }

  const onMouseEnter = () => setHoveredTpopId(row.id)

  const onChange = (e: { target: { value: string } }) => {
    const value = e.target.value || ''
    setStateValue(value)
  }

  const onBlur = async (e: { target: { value: string } }) => {
    const value = e.target.value ? +e.target.value : null
    setProcessing(true)
    await processChange({
      value,
      ekfrequenz,
      row,
    })
    setProcessing(false)
  }

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={resetHovered}
      style={{
        minWidth: width,
        maxWidth: width,
        backgroundColor:
          isHovered ? 'hsla(45, 100%, 90%, 1)'
          : isOdd ? 'rgb(255, 255, 252)'
          : 'unset',
      }}
      className={styles.container}
    >
      <input
        value={stateValue}
        onChange={onChange}
        onBlur={(e) => void onBlur(e)}
        className={styles.input}
      />
    </div>
  )
}
