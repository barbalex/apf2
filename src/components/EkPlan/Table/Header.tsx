import { useContext } from 'react'
import { sortBy } from 'es-toolkit'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'

import { MobxContext } from '../../../mobxContext.ts'
import { fields } from './fields.ts'
import { CellHeaderFixed } from './CellHeaderFixed/index.tsx'
import { CellHeaderFixedEkfrequenz } from './CellHeaderFixedEkfrequenz.tsx'
import { CellHeaderFixedEkfrequenzStartjahr } from './CellHeaderFixedEkfrequenzStartjahr.tsx'
import { CellHeaderFixedTpopStatus } from './CellHeaderFixedTpopStatus/index.tsx'
import { CellHeaderYear } from './CellHeaderYear.tsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.tsx'

import styles from './Header.module.css'

export const EkplanTableHeader = observer(
  ({ tpopLength, refetch, tpopFilter, years }) => {
    const store = useContext(MobxContext)
    // without snapshot headerFieldsFixed does not update correctly (?) when fields change
    const fieldsShown = getSnapshot(store.ekPlan.fields)

    const headerFieldsFixed = sortBy(
      Object.values(fields).filter(
        (o) => fieldsShown.includes(o.name) || !!o.alwaysShow,
      ),
      ['sort'],
    )

    return (
      <ErrorBoundary>
        <div className={styles.container}>
          <h4 className={styles.title}>{`${tpopLength} Teilpopulationen`}</h4>
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
        </div>
      </ErrorBoundary>
    )
  },
)
