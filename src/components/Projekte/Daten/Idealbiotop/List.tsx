import { Suspense } from 'react'

import { List as SharedList } from '../../../shared/List/index.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { useIdealbiotopNavData } from '../../../../modules/useIdealbiotopNavData.ts'

export const List = () => {
  const { navData } = useIdealbiotopNavData()

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList navData={navData} />
    </Suspense>
  )
}
