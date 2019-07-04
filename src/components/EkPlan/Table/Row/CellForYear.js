import React, { useCallback } from 'react'
import { GoArrowRight } from 'react-icons/go'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
// this will be for Massnahmen
import { GiSpade } from 'react-icons/gi'
import { GoZap } from 'react-icons/go'

import { TableCellForYear } from './index'
import EkfIcon from '../../../../icons/Ekf'
import EkIcon from '../../../../icons/Ek'

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

const CellForYear = ({
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
      key={label}
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
      <>
        {value.ekPlan && (
          <div title="EK geplant" aria-label="EK geplant">
            EK!
          </div>
        )}
        {value.ekfPlan && (
          <div title="EKF geplant" aria-label="EKF geplant">
            EKF!
          </div>
        )}
        {!!value.az.length && (
          <AzContainer>
            <AzIcon title="Ausgangszustand" aria-label="Ausgangszustand" />
            {value.az.length > 1 && <NrOfEvents>{value.az.length}</NrOfEvents>}
          </AzContainer>
        )}
        {!!value.ek.length && (
          <div title="EK" aria-label="EK">
            <EkIcon width="25px" height="20px" />
            {value.ek.length > 1 && <NrOfEvents>{value.ek.length}</NrOfEvents>}
          </div>
        )}
        {!!value.ekf.length && (
          <div title="EKF" aria-label="EKF">
            <EkfIcon width="25px" height="20px" />
            {value.ekf.length > 1 && (
              <NrOfEvents>{value.ekf.length}</NrOfEvents>
            )}
          </div>
        )}
      </>
    </TableCellForYear>
  )
}

export default observer(CellForYear)
