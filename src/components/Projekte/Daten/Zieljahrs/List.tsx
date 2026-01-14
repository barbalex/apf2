import { useContext, Suspense } from 'react'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'
import { useZieljahrsNavData } from '../../../../modules/useZieljahrsNavData.js'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { Error } from '../../../shared/Error.tsx'
import { Menu } from './Menu.tsx'

export const List = observer(() => {
  const store = useContext(MobxContext)
  const { nodeLabelFilter } = store.tree

  const { navData, error } = useZieljahrsNavData()

  if (error) return <Error error={error} />

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        navData={navData}
        MenuBarComponent={Menu}
        highlightSearchString={nodeLabelFilter.ziel}
      />
    </Suspense>
  )
})
