import { MenuBar } from '../shared/MenuBar/index.jsx'
import { FilterButton } from '../shared/MenuBar/FilterButton.jsx'
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
