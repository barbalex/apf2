import { Suspense } from 'react'

import { List as SharedList } from '../../../shared/List/index.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { useIdealbiotopNavData } from '../../../../modules/useIdealbiotopNavData.js'

export const List = () => {
  const { navData, error } = useIdealbiotopNavData()

  if (error) return <Error error={error} />

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList navData={navData} />
    </Suspense>
  )
}
