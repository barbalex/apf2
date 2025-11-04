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
import { hover } from 'framer-motion'

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

    const classes = [
      ...(hovered.year === year ? ['column-hovered'] : []),
      ...(hovered.tpopId === row.id ? ['tpop-hovered'] : []),
    ]
    const className = classes.join(' ')

    const cellStyle = {
      width: yearColumnWidth,
      minWidth: yearColumnWidth,
      // WEIRD: this is not applied for clicked
      backgroundColor:
        clicked ? 'rgb(255,211,167) !important'
        : isOdd ? 'rgb(255, 255, 252)'
        : 'unset',
      // applying a border instead
      ...(clicked ? { border: '2px solid rgb(255, 140, 0)' } : {}),
    }

    return (
      <StyledTableCell
        onMouseEnter={onMouseEnter}
        onMouseLeave={hovered.reset}
        onClick={onClickCell}
        className={className}
        style={cellStyle}
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
