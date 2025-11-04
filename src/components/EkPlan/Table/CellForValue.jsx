import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../mobxContext.js'

import { container } from './CellForValue.module.css'
import { tableCell } from './index.module.css'

export const CellForValue = observer(
  ({ field, width, row, isOdd, firstChild }) => {
    const store = useContext(MobxContext)

    const { value } = field

    const { hovered } = store.ekPlan
    const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''
    const onMouseEnter = () => hovered.setTpopId(row.id)

    const tableCellStyle = {
      width,
      minWidth: width,
      paddingLeft: firstChild ? 10 : 2,
      backgroundColor: isOdd ? 'rgb(255, 255, 252)' : 'unset',
    }

    return (
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={hovered.reset}
        className={`${className} ${tableCell}`}
        style={tableCellStyle}
      >
        <div className={container}>
          <div>{value}</div>
        </div>
      </div>
    )
  },
)
