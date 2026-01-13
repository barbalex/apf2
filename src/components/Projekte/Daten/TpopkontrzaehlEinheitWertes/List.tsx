import { useContext, Suspense } from 'react'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'
import { useTpopkontrzaehlEinheitWertesNavData } from '../../../../modules/useTpopkontrzaehlEinheitWertesNavData.js'
import { List as SharedList } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.tsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const List = observer(() => {
  const store = useContext(MobxContext)
  const { nodeLabelFilter } = store.tree

  const { navData, error } = useTpopkontrzaehlEinheitWertesNavData()

  if (error) return <Error error={error} />

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        navData={navData}
        MenuBarComponent={Menu}
        highlightSearchString={nodeLabelFilter.tpopkontrzaehlEinheitWerte}
      />
    </Suspense>
  )
})
