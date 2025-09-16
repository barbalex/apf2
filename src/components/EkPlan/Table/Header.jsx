import { memo, useContext, useMemo } from 'react'
import styled from '@emotion/styled'
import { sortBy } from 'es-toolkit'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import { MobxContext } from '../../../mobxContext.js'
import { fields } from './fields.js'
import { CellHeaderFixed } from './CellHeaderFixed/index.jsx'
import { CellHeaderFixedEkfrequenz } from './CellHeaderFixedEkfrequenz.jsx'
import { CellHeaderFixedEkfrequenzStartjahr } from './CellHeaderFixedEkfrequenzStartjahr.jsx'
import { CellHeaderFixedTpopStatus } from './CellHeaderFixedTpopStatus/index.jsx'
import { CellHeaderYear } from './CellHeaderYear.jsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: sticky;
  top: 0;
  z-index: 1;
`
const TpopTitle = styled.h4`
  position: absolute;
  left: 10px;
  z-index: 3;
  top: -20px;
`

export const EkplanTableHeader = memo(
  observer(({ tpopLength, refetch, tpopFilter, years }) => {
    const store = useContext(MobxContext)
    // without snapshot headerFieldsFixed does not update correctly (?) when fields change
    const fieldsShown = getSnapshot(store.ekPlan.fields)

    const headerFieldsFixed = useMemo(
      () =>
        sortBy(
          Object.values(fields).filter(
            (o) => fieldsShown.includes(o.name) || !!o.alwaysShow,
          ),
          ['sort'],
        ),
      [fieldsShown, fields],
    )

    return (
      <ErrorBoundary>
        <HeaderContainer>
          <TpopTitle>{`${tpopLength} Teilpopulationen`}</TpopTitle>
          {headerFieldsFixed.map((column, index) => {
            const field = column.name
            if (field === 'ekfrequenz') {
              return (
                <CellHeaderFixedEkfrequenz
                  key={column.name}
                  column={column}
                />
              )
            }
            if (field === 'ekfrequenzStartjahr') {
              return (
                <CellHeaderFixedEkfrequenzStartjahr
                  key={column.name}
                  column={column}
                />
              )
            }
            if (field === 'status') {
              return (
                <CellHeaderFixedTpopStatus
                  key={column.name}
                  column={column}
                  refetch={refetch}
                />
              )
            }
            if (field === 'popStatus') {
              return (
                <CellHeaderFixedTpopStatus
                  key={column.name}
                  column={column}
                  refetch={refetch}
                  type="pop"
                />
              )
            }
            return (
              <CellHeaderFixed
                key={column.name}
                column={column}
              />
            )
          })}
          {years.map((year, index) => (
            <CellHeaderYear
              key={`yearsColumn/${year}`}
              column={year}
              tpopFilter={tpopFilter}
            />
          ))}
        </HeaderContainer>
      </ErrorBoundary>
    )
  }),
)
