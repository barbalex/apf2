import React, { useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { TableCellForYear } from './index'
import EkIcon from './Row/EkIcon'
import MassnIcon from './Row/MassnIcon'
import { InfoRow } from './index'
import storeContext from '../../../storeContext'

const CellForYear = ({ field, row, style }) => {
  const store = useContext(storeContext)
  const {
    showEk,
    showEkf,
    showMassn,
    setYearMenuAnchor,
    yearClicked,
    setYearClicked,
    resetYearHovered,
    columnHovered,
    setColumnHovered,
    einheitsByAp,
  } = store.ekPlan

  const { label, value, width } = field
  const onMouseEnter = useCallback(() => setColumnHovered(label), [label])
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
      // can't pass currentTarget directly as anchorEl
      // because it does not exist any more until the menu wants to look it up
      // need to pass measurements instead
      setYearMenuAnchor(event.currentTarget.getBoundingClientRect())
    },
    [row],
  )
  const className = columnHovered === label ? 'hovered' : ''
  //console.log('CellForYear, value:', value)

  return (
    <TableCellForYear
      width={width}
      onMouseEnter={onMouseEnter}
      onMouseLeave={resetYearHovered}
      data-clicked={clicked}
      onClick={onClickCell}
      className={className}
      style={style}
    >
      <InfoRow>
        {showEk && (
          <EkIcon planned={value.ekPlan} eks={value.eks} einheits={einheits} />
        )}
      </InfoRow>
      <InfoRow>
        {showEkf && (
          <EkIcon
            planned={value.ekfPlan}
            eks={value.ekfs}
            einheits={einheits}
          />
        )}
      </InfoRow>
      <InfoRow>
        {showMassn && <MassnIcon ansiedlungs={value.ansiedlungs} />}
      </InfoRow>
    </TableCellForYear>
  )
}

export default observer(CellForYear)
