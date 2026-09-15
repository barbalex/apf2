import { Suspense } from 'react'

import { useCurrentissuesNavData } from '../../../../modules/useCurrentissuesNavData.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'

import type { NavData } from '../../../Bookmarks/types.ts'

export const List = () => {
  const navData = useCurrentissuesNavData()

  // the nav data hook returns a wider shape than SharedList's NavData:
  // menus can be undefined and their ids/labels nullable
  const navDataForList = {
    ...navData,
    menus: navData.menus ?? [],
  } as NavData

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList navData={navDataForList} />
    </Suspense>
  )
}
