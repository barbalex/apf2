import { memo, useContext, useCallback } from 'react'
import { observer } from 'mobx-react-lite'

import { Checkbox } from './Checkbox.jsx'
import { StyledCellForSelect } from './index.jsx'
import { MobxContext } from '../../../storeContext.js'

export const CellForEkfrequenzAbweichend = memo(
  observer(({ field, row, style }) => {
    const store = useContext(MobxContext)

    const { hovered } = store.ekPlan
    const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''
    const onMouseEnter = useCallback(
      () => hovered.setTpopId(row.id),
      [hovered, row.id],
    )

    return (
      <StyledCellForSelect
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={hovered.reset}
        className={className}
        data-isodd={row.isOdd}
      >
        <Checkbox
          row={row.tpop}
          value={field.value}
          field="ekfrequenzAbweichend"
        />
      </StyledCellForSelect>
    )
  }),
)
