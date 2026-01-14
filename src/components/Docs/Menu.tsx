import { MenuBar } from '../shared/MenuBar/index.tsx'
import { FilterButton } from '../shared/MenuBar/FilterButton.tsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.tsx'

export const Menu = ({ toggleFilterInput }) => {
  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
      </MenuBar>
    </ErrorBoundary>
  )
}
