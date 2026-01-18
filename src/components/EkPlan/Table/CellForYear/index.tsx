import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { EkIcon } from './EkIcon.tsx'
import { MassnIcon } from './MassnIcon.tsx'
import { MobxContext } from '../../../../mobxContext.ts'
import { query } from './query.ts'
import { yearColumnWidth } from './yearColumnWidth.ts'

import indexStyles from '../index.module.css'

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

    const isHovered = hovered.year === year || hovered.tpopId === row.id

    const cellStyle = {
      width: yearColumnWidth,
      minWidth: yearColumnWidth,
      backgroundColor:
        clicked ? 'rgb(255,211,167)'
        : isHovered ? 'hsla(45, 100%, 90%, 1)'
        : isOdd ? 'rgb(255, 255, 252)'
        : 'unset',
      ...(clicked ? { border: '2px solid rgb(255, 140, 0)' } : {}),
    }

    return (
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={hovered.reset}
        onClick={onClickCell}
        className={indexStyles.tableCell}
        style={cellStyle}
      >
        <div className={indexStyles.infoRow}>
          {showEk && (
            <EkIcon
              planned={ekPlan}
              eks={eks}
              einheits={einheits}
            />
          )}
        </div>
        <div className={indexStyles.infoRow}>
          {showEkf && (
            <EkIcon
              planned={ekfPlan}
              eks={ekfs}
              einheits={einheits}
            />
          )}
        </div>
        <div className={indexStyles.infoRow}>
          {showMassn && <MassnIcon ansiedlungs={ansiedlungs} />}
        </div>
      </div>
    )
  },
)
