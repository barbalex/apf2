import { memo, useContext, useMemo } from 'react'
import styled from '@emotion/styled'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../mobxContext.js'
import { getYears } from './getYears.js'
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
  z-index: 9;
`
const TpopTitle = styled.h4`
  position: absolute;
  left: 10px;
  z-index: 3;
  top: -20px;
`

export const EkplanTableHeader = memo(
  observer(({ tpopLength, refetch, tpopFilter }) => {
    const store = useContext(MobxContext)

    const years = useMemo(
      () => getYears(store.ekPlan.pastYears),
      [store.ekPlan.pastYears],
    )
    const headerFieldsFixed = useMemo(
      () =>
        sortBy(
          Object.values(fields).filter(
            (o) => store.ekPlan.fields.includes(o.name) || !!o.alwaysShow,
          ),
          'sort',
        ),
      [store.ekPlan.fields],
    )

    return (
      <ErrorBoundary>
        <HeaderContainer>
          <TpopTitle>{`${tpopLength} Teilpopulationen`}</TpopTitle>
          {headerFieldsFixed.map((column, index) => {
            const field = column.name
            if (field === 'ekfrequenz') {
              return (
                <CellHeaderFixedEkfrequenz key={column.name} column={column} />
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
            return <CellHeaderFixed key={column.name} column={column} />
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
