import React, { useCallback, useContext, useMemo } from 'react'
import { observer } from 'mobx-react-lite'

import { TableCellForYear } from '../index'
import EkIcon from './EkIcon'
import MassnIcon from './MassnIcon'
import { InfoRow } from '../index'
import storeContext from '../../../../storeContext'

const CellForYearTitle = ({ field, row }) => {
  const store = useContext(storeContext)
  const {
    showEk,
    showEkf,
    showMassn,
    setYearMenuAnchor,
    yearClicked,
    setYearClicked,
    resetYearHovered,
    setColumnHovered,
    einheitsByAp,
  } = store.ekPlan

  const { label, value, width, name } = field
  const onMouseEnter = useCallback(() => setColumnHovered(`_${label}_`), [
    label,
  ])
  const { year, tpopId } = yearClicked
  const clicked = year === label && tpopId === row.id
  const einheits = einheitsByAp[row.apId]
  const onClickCell = useCallback(
    event => {
      setYearClicked({
        year: label,
        tpopId: row.id,
        title: `${row.ap.value} Pop: ${row.popNr.value}, TPop: ${row.nr.value}, ${label}`,
        ekPlan: value.ekPlan,
        ekfPlan: value.ekfPlan,
      })
      setTimeout(() => setYearMenuAnchor(event.currentTarget))
    },
    [row],
  )
  const className = useMemo(() => `_${name}_`, [name])

  return (
    <TableCellForYear
      width={width}
      onMouseEnter={onMouseEnter}
      onMouseLeave={resetYearHovered}
      data-clicked={clicked}
      onClick={onClickCell}
      className={className}
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
      <InfoRow>
        {showMassn && <MassnIcon ansiedlungs={value.ansiedlungs} />}
      </InfoRow>
    </TableCellForYear>
  )
}

export default observer(CellForYearTitle)
