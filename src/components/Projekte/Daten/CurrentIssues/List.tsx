import { Suspense } from 'react'

import { useCurrentissuesNavData } from '../../../../modules/useCurrentissuesNavData.js'
import { List as SharedList } from '../../../shared/List/index.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const List = () => {
  const { navData, error } = useCurrentissuesNavData()

  if (error) return <Error error={error} />

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList navData={navData} />
    </Suspense>
  )
}
