import { useContext, Suspense } from 'react'
import { observer } from 'mobx-react-lite'
import { useAtom } from 'jotai'

import { MobxContext } from '../../../../mobxContext.ts'
import { useApbersNavData } from '../../../../modules/useApbersNavData.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { isDesktopViewAtom } from '../../../../JotaiStore/index.ts'

export const List = observer(() => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  const store = useContext(MobxContext)
  const { nodeLabelFilter } = store.tree

  const { navData } = useApbersNavData()

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        navData={navData}
        MenuBarComponent={Menu}
        highlightSearchString={nodeLabelFilter.apber}
      />
    </Suspense>
  )
})
