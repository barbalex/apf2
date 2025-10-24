import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client/react'

import { StyledTableCell } from '../index.jsx'
import { EkIcon } from './EkIcon.jsx'
import { MassnIcon } from './MassnIcon.jsx'
import { InfoRow } from '../index.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { query } from './query.js'
import { yearColumnWidth } from './yearColumnWidth.js'

export const CellForYear = observer(
  ({ year, row, isOdd, ekPlan, ekfPlan, eks, ekfs, ansiedlungs }) => {
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

    const onMouseEnter = () => hovered.set({ year, tpopId: row.id })
    const clicked = yearClicked.year === year && yearClicked.tpopId === row.id
    const einheits = einheitsByAp[row.apId]

    const onClickCell = (event) => {
      setYearClicked({
        year,
        tpopId: row.id,
        title: `${row.ap.value} Pop: ${row.popNr.value}, TPop: ${row.nr.value}, ${year}`,
        ekPlan,
        ekfPlan,
      })
      // can't pass currentTarget directly as anchorEl
      // because it does not exist any more until the menu wants to look it up
      // need to pass measurements instead
      setYearMenuAnchor(event.currentTarget.getBoundingClientRect())
    }

    const classes = []
    if (hovered.year === year) classes.push('column-hovered')
    if (hovered.tpopId === row.id) classes.push('tpop-hovered')
    const className = classes.join(' ')

    return (
      <StyledTableCell
        width={yearColumnWidth}
        onMouseEnter={onMouseEnter}
        onMouseLeave={hovered.reset}
        data-clicked={clicked}
        data-isodd={isOdd}
        onClick={onClickCell}
        className={className}
      >
        <InfoRow>
          {showEk && (
            <EkIcon
              planned={ekPlan}
              eks={eks}
              einheits={einheits}
            />
          )}
        </InfoRow>
        <InfoRow>
          {showEkf && (
            <EkIcon
              planned={ekfPlan}
              eks={ekfs}
              einheits={einheits}
            />
          )}
        </InfoRow>
        <InfoRow>
          {showMassn && <MassnIcon ansiedlungs={ansiedlungs} />}
        </InfoRow>
      </StyledTableCell>
    )
  },
)
