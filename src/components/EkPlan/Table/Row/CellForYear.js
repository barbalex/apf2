import React, { useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'
// this will be for Massnahmen
import { GiSpade } from 'react-icons/gi'
import { GoZap } from 'react-icons/go'

import { TableCellForYear } from '../index'
import EkIcon from './EkIcon'
import { InfoRow } from '../index'
import storeContext from '../../../../storeContext'

const CellForYearTitle = ({
  field,
  row,
  setColumnHovered,
  resetYearHovered,
  scrollPositions,
  yearClickedState,
  yearClickedDispatch,
  setYearMenuAnchor,
  einheitsByAp,
}) => {
  const store = useContext(storeContext)
  const { showEk, showEkf, showMassn } = store.ekPlan

  const { label, value, width, name } = field
  const onMouseEnter = useCallback(() => setColumnHovered(`_${label}_`), [
    label,
  ])
  const { year, tpopId } = yearClickedState
  const clicked = year === label && tpopId === row.id
  const einheits = einheitsByAp[row.apId]

  return (
    <TableCellForYear
      width={width}
      onMouseEnter={onMouseEnter}
      onMouseLeave={resetYearHovered}
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
      className={`_${name}_`}
    >
      <InfoRow>
        {showEk && (
          <EkIcon planned={value.ekPlan} eks={value.ek} einheits={einheits} />
        )}
      </InfoRow>
      <InfoRow>
        {showEkf && (
          <EkIcon planned={value.ekfPlan} eks={value.ekf} einheits={einheits} />
        )}
      </InfoRow>
      <InfoRow>{showMassn && 'TODO'}</InfoRow>
    </TableCellForYear>
  )
}

export default observer(CellForYearTitle)
