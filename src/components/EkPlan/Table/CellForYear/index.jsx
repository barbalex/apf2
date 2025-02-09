import { memo, useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'

import { StyledTableCell } from '../index.jsx'
import { EkIcon } from './EkIcon.jsx'
import { MassnIcon } from './MassnIcon.jsx'
import { InfoRow } from '../index.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { query } from './query.js'

export const CellForYear = memo(
  observer(({ field, row, ekPlan, ekfPlan, eks, ekfs, ansiedlungs, style }) => {
    const store = useContext(MobxContext)
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
      [hovered, label, row.id],
    )
    const { year, tpopId } = yearClicked
    const clicked = year === label && tpopId === row.id
    const einheits = einheitsByAp[row.apId]
    const onClickCell = useCallback(
      (event) => {
        setYearClicked({
          year: label,
          tpopId: row.id,
          title: `${row.ap.value} Pop: ${row.popNr.value}, TPop: ${row.nr.value}, ${label}`,
          ekPlan,
          ekfPlan,
        })
        // can't pass currentTarget directly as anchorEl
        // because it does not exist any more until the menu wants to look it up
        // need to pass measurements instead
        setYearMenuAnchor(event.currentTarget.getBoundingClientRect())
      },
      [
        label,
        row.ap.value,
        row.id,
        row.nr.value,
        row.popNr.value,
        setYearClicked,
        setYearMenuAnchor,
        ekPlan,
        ekfPlan,
      ],
    )
    const classes = []
    if (hovered.year === label) classes.push('column-hovered')
    if (hovered.tpopId === row.id) classes.push('tpop-hovered')
    const className = classes.join(' ')

    return (
      <StyledTableCell
        width={width}
        onMouseEnter={onMouseEnter}
        onMouseLeave={hovered.reset}
        data-clicked={clicked}
        data-isodd={row.isOdd}
        onClick={onClickCell}
        className={className}
        style={style}
      >
        <InfoRow>
          {showEk && <EkIcon planned={ekPlan} eks={eks} einheits={einheits} />}
        </InfoRow>
        <InfoRow>
          {showEkf && (
            <EkIcon planned={ekfPlan} eks={ekfs} einheits={einheits} />
          )}
        </InfoRow>
        <InfoRow>
          {showMassn && <MassnIcon ansiedlungs={ansiedlungs} />}
        </InfoRow>
      </StyledTableCell>
    )
  }),
)
