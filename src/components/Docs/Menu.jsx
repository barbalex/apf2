import { memo } from 'react'

import { MenuBar } from '../shared/MenuBar/index.jsx'
import { FilterButton } from '../shared/MenuBar/FilterButton.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'

export const Menu = memo(({ toggleFilterInput }) => {
  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
      </MenuBar>
    </ErrorBoundary>
  )
})
