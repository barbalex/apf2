import { Suspense } from 'react'

import { List as SharedList } from '../../../shared/List/index.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { Error } from '../../../shared/Error.tsx'
import { useProjektNavData } from '../../../../modules/useProjektNavData.js'

export const List = () => {
  const { navData, error } = useProjektNavData()

  if (error) return <Error error={error} />

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList navData={navData} />
    </Suspense>
  )
}
