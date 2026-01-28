import { useState, useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import {
  ekPlanHoveredAtom,
  ekPlanSetHoveredTpopIdAtom,
  ekPlanResetHoveredAtom,
} from '../../../../store/index.ts'
import { tpop } from '../../../shared/fragments.ts'
import { setEkplans } from '../setEkplans/index.tsx'
import { processChange } from './processChange.ts'

import styles from './index.module.css'

export const CellForEkfrequenzStartjahr = ({
  row,
  isOdd,
  width,
  setProcessing,
  ekfrequenzStartjahr,
  ekfrequenz,
}) => {
  const hovered = useAtomValue(ekPlanHoveredAtom)
  const setHoveredTpopId = useSetAtom(ekPlanSetHoveredTpopIdAtom)
  const resetHovered = useSetAtom(ekPlanResetHoveredAtom)
  const isHovered = hovered.tpopId === row.id

  const [stateValue, setStateValue] = useState(ekfrequenzStartjahr ?? '')
  useEffect(
    () => setStateValue(ekfrequenzStartjahr ?? ''),
    [ekfrequenzStartjahr],
  )

  const onMouseEnter = () => setHoveredTpopId(row.id)

  const onChange = (e) => {
    const value = e.target.value || e.target.value === 0 ? e.target.value : ''
    setStateValue(value)
  }

  const onBlur = async (e) => {
    const value =
      e.target.value || e.target.value === 0 ? +e.target.value : null
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
      onMouseLeave={hovered.reset}
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
        onBlur={onBlur}
        className={styles.input}
      />
    </div>
  )
}
