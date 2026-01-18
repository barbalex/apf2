import { Suspense } from 'react'

import { useCurrentissuesNavData } from '../../../../modules/useCurrentissuesNavData.ts'
import { List as SharedList } from '../../../shared/List/index.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'

export const List = () => {
  const { navData } = useCurrentissuesNavData()

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList navData={navData} />
    </Suspense>
  )
}
