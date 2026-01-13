import { Suspense } from 'react'
import { useParams } from 'react-router'

import { List as SharedList } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.tsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { useApNavData } from '../../../../modules/useApNavData.js'

export const List = () => {
  const params = useParams<{ projId: string }>()
  const { navData, error } = useApNavData(params)

  if (error) return <Error error={error} />

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        navData={navData}
        MenuBarComponent={Menu}
      />
    </Suspense>
  )
}
