import { useContext, Suspense } from 'react'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.ts'
import { useBeobNichtZuzuordnensNavData } from '../../../../modules/useBeobNichtZuzuordnensNavData.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from '../BeobNichtBeurteilts/Menu.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'

const menuBarProps = { apfloraLayer: 'beobNichtZuzuordnen' }

export const List = observer(() => {
  const store = useContext(MobxContext)
  const { nodeLabelFilter } = store.tree

  const { navData } = useBeobNichtZuzuordnensNavData()

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        navData={navData}
        MenuBarComponent={Menu}
        menuBarProps={menuBarProps}
        highlightSearchString={nodeLabelFilter.beob}
      />
    </Suspense>
  )
})
