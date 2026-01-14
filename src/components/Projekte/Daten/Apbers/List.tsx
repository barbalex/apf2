import { useContext, Suspense } from 'react'
import { observer } from 'mobx-react-lite'
import { useAtom } from 'jotai'

import { MobxContext } from '../../../../mobxContext.js'
import { useApbersNavData } from '../../../../modules/useApbersNavData.js'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { Error } from '../../../shared/Error.tsx'
import { isDesktopViewAtom } from '../../../../JotaiStore/index.js'

export const List = observer(() => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  const store = useContext(MobxContext)
  const { nodeLabelFilter } = store.tree

  const { navData, error } = useApbersNavData()

  if (error) return <Error error={error} />

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
