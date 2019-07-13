import React, { useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { TableCellForYear } from './index'
import EkIcon from './EkIcon'
import MassnIcon from './MassnIcon'
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
    einheitsByAp,
    hovered,
  } = store.ekPlan

  const { label, value, width } = field
  const onMouseEnter = useCallback(
    () => hovered.set({ year: label, tpopId: row.id }),
    [label, row.id],
  )
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
  const classes = []
  if (hovered.year === label) classes.push('column-hovered')
  if (hovered.tpopId === row.id) classes.push('tpop-hovered')
  const className = classes.join(' ')

  return (
    <TableCellForYear
      width={width}
      onMouseEnter={onMouseEnter}
      onMouseLeave={hovered.reset}
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
