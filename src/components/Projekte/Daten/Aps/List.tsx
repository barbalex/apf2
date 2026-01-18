import { useContext, Suspense } from 'react'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { useApsNavData } from '../../../../modules/useApsNavData.ts'

export const List = observer(() => {
  const store = useContext(MobxContext)
  const { nodeLabelFilter } = store.tree

  const navData = useApsNavData()

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        navData={navData}
        MenuBarComponent={Menu}
        highlightSearchString={nodeLabelFilter.ap}
      />
    </Suspense>
  )
})
