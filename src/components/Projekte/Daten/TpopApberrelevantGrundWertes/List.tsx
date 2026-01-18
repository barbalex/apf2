import { useContext, Suspense } from 'react'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.ts'
import { useTpopApberrelevantGrundWertesNavData } from '../../../../modules/useTpopApberrelevantGrundWertesNavData.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'

export const List = observer(() => {
  const store = useContext(MobxContext)
  const { nodeLabelFilter } = store.tree

  const { navData } = useTpopApberrelevantGrundWertesNavData()

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        navData={navData}
        MenuBarComponent={Menu}
        highlightSearchString={nodeLabelFilter.tpopApberrelevantGrundWerte}
      />
    </Suspense>
  )
})
