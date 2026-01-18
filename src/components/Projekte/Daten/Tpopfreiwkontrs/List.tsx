import { useContext, Suspense } from 'react'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.ts'
import { useTpopfreiwkontrsNavData } from '../../../../modules/useTpopfreiwkontrsNavData.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'

export const List = observer(() => {
  const store = useContext(MobxContext)
  const { nodeLabelFilter } = store.tree

  const navData = useTpopfreiwkontrsNavData()

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        navData={navData}
        MenuBarComponent={Menu}
        highlightSearchString={nodeLabelFilter.tpopkontr}
      />
    </Suspense>
  )
})
