import React, { useCallback } from 'react'
import { GoArrowRight } from 'react-icons/go'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
// this will be for Massnahmen
import { GiSpade } from 'react-icons/gi'
import { GoZap } from 'react-icons/go'

import { TableCellForYear } from '../index'
import EkfIcon from '../../../../icons/Ekf'
import EkSymbol from '../../../../icons/Ek'
import EkIcon from './EkIcon'
import { InfoRow } from '../index'

const AzContainer = styled.div`
  display: flex;
  height: 25px;
`
const AzIcon = styled(GoArrowRight)`
  font-size: 1.5rem;
`
const NrOfEvents = styled.span`
  bottom: 12px;
  left: -2px;
  position: relative;
`

const CellForYearTitle = ({
  field,
  row,
  columnHovered,
  setColumnHovered,
  resetYearHovered,
  scrollPositions,
  yearClickedState,
  yearClickedDispatch,
  setYearMenuAnchor,
}) => {
  const { label, value, width } = field
  const onMouseEnter = useCallback(() => setColumnHovered(label), [label])
  const { year, tpopId } = yearClickedState
  const clicked = year === label && tpopId === row.id

  return (
    <TableCellForYear
      width={width}
      onMouseEnter={onMouseEnter}
      onMouseLeave={resetYearHovered}
      data-columnishovered={columnHovered === label}
      data-clicked={clicked}
      onClick={event => {
        yearClickedDispatch({
          type: 'set',
          payload: {
            year: label,
            tpopId: row.id,
            tpop: `${row.ap.value} Pop: ${row.popNr.value}, TPop: ${row.tpopNr.value}`,
            ekPlan: value.ekPlan,
            ekfPlan: value.ekfPlan,
          },
        })
        const currentTarget = event.currentTarget
        setTimeout(() => setYearMenuAnchor(currentTarget))
      }}
    >
      <InfoRow>
        <EkIcon planned={value.ekPlan} done={value.ek.length} />
      </InfoRow>
      <InfoRow>
        <EkIcon planned={value.ekfPlan} done={value.ekf.length} />
      </InfoRow>
    </TableCellForYear>
  )
}

export default observer(CellForYearTitle)
