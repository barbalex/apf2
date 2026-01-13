import { useContext, Suspense } from 'react'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'
import { useBeobNichtZuzuordnensNavData } from '../../../../modules/useBeobNichtZuzuordnensNavData.js'
import { List as SharedList } from '../../../shared/List/index.jsx'
import { Menu } from '../BeobNichtBeurteilts/Menu.tsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

const menuBarProps = { apfloraLayer: 'beobNichtZuzuordnen' }

export const List = observer(() => {
  const store = useContext(MobxContext)
  const { nodeLabelFilter } = store.tree

  const { navData, error } = useBeobNichtZuzuordnensNavData()

  if (error) return <Error error={error} />

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
