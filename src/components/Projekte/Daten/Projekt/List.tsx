import { Suspense } from 'react'

import { List as SharedList } from '../../../shared/List/index.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { useProjektNavData } from '../../../../modules/useProjektNavData.ts'

export const List = () => {
  const { navData } = useProjektNavData()

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList navData={navData} />
    </Suspense>
  )
}
