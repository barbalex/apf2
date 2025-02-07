import { memo, useContext, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { gql, useQuery } from '@apollo/client'

import { Checkbox } from './Checkbox.jsx'
import { StyledCellForSelect } from './index.jsx'
import { MobxContext } from '../../../mobxContext.js'

export const CellForEkfrequenzAbweichend = memo(
  observer(({ field, row, width }) => {
    const store = useContext(MobxContext)

    const { data } = useQuery(
      gql`
        query EkfrequenzabweichendQueryForCellForEkfrequenzAbweichend(
          $tpopId: UUID!
        ) {
          tpopById(id: $tpopId) {
            id
            ekfrequenzAbweichend
          }
        }
      `,
      { variables: { tpopId: row.id } },
    )
    const ekfrequenzAbweichend = data?.tpopById?.ekfrequenzAbweichend

    const { hovered } = store.ekPlan
    const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''
    const onMouseEnter = useCallback(
      () => hovered.setTpopId(row.id),
      [hovered, row.id],
    )

    return (
      <StyledCellForSelect
        width={width}
        onMouseEnter={onMouseEnter}
        onMouseLeave={hovered.reset}
        className={className}
        data-isodd={row.isOdd}
      >
        <Checkbox
          row={row.tpop}
          value={ekfrequenzAbweichend}
          field="ekfrequenzAbweichend"
        />
      </StyledCellForSelect>
    )
  }),
)
