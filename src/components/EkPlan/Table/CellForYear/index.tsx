import { useAtomValue, useSetAtom } from 'jotai'

import { EkIcon } from './EkIcon.tsx'
import { MassnIcon } from './MassnIcon.tsx'
import {
  ekPlanShowEkAtom,
  ekPlanShowEkfAtom,
  ekPlanShowMassnAtom,
  ekPlanYearMenuAnchorAtom,
  ekPlanYearClickedAtom,
  ekPlanYearClickedAtom,
  ekPlanEinheitsByApAtom,
  ekPlanHoveredAtom,
  ekPlanResetHoveredAtom,
} from '../../../../store/index.ts'
import { query } from './query.ts'
import { yearColumnWidth } from './yearColumnWidth.ts'

import indexStyles from '../index.module.css'

export const CellForYear = ({
  year,
  row,
  isOdd,
  ekPlan,
  ekfPlan,
  eks,
  ekfs,
  ansiedlungs,
}) => {
  const showEk = useAtomValue(ekPlanShowEkAtom)
  const showEkf = useAtomValue(ekPlanShowEkfAtom)
  const showMassn = useAtomValue(ekPlanShowMassnAtom)
  const setYearMenuAnchor = useSetAtom(ekPlanYearMenuAnchorAtom)
  const yearClicked = useAtomValue(ekPlanYearClickedAtom)
  const setYearClicked = useSetAtom(ekPlanYearClickedAtom)
  const einheitsByAp = useAtomValue(ekPlanEinheitsByApAtom)
  const hovered = useAtomValue(ekPlanHoveredAtom)
  const setHovered = useSetAtom(ekPlanHoveredAtom)
  const resetHovered = useSetAtom(ekPlanResetHoveredAtom)

  const onMouseEnter = () => setHovered({ year, tpopId: row.id })
  const clicked = yearClicked.year === year && yearClicked.tpopId === row.id
  const einheits = einheitsByAp[row.apId]

  const onClickCell = (event) => {
    setYearClicked({
      year,
      tpopId: row.id,
      title: `${row.ap?.value ?? ''} Pop: ${row.popNr?.value ?? ''}, TPop: ${row.nr?.value ?? ''}, ${year}`,
      ekPlan,
      ekfPlan,
    })
    // can't pass currentTarget directly as anchorEl
    // because it does not exist any more until the menu wants to look it up
    // need to pass measurements instead
    setYearMenuAnchor(event.currentTarget.getBoundingClientRect())
  }

  const isHovered = hovered.year === year || hovered.tpopId === row.id

  const cellStyle = {
    width: yearColumnWidth,
    minWidth: yearColumnWidth,
    backgroundColor: clicked
      ? 'rgb(255,211,167)'
      : isHovered
        ? 'hsla(45, 100%, 90%, 1)'
        : isOdd
          ? 'rgb(255, 255, 252)'
          : 'unset',
    ...(clicked ? { border: '2px solid rgb(255, 140, 0)' } : {}),
  }

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={resetHovered}
      onClick={onClickCell}
      className={indexStyles.tableCell}
      style={cellStyle}
    >
      <div className={indexStyles.infoRow}>
        {showEk && <EkIcon planned={ekPlan} eks={eks} einheits={einheits} />}
      </div>
      <div className={indexStyles.infoRow}>
        {showEkf && <EkIcon planned={ekfPlan} eks={ekfs} einheits={einheits} />}
      </div>
      <div className={indexStyles.infoRow}>
        {showMassn && <MassnIcon ansiedlungs={ansiedlungs} />}
      </div>
    </div>
  )
}
