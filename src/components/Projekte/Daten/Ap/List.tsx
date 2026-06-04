import { Suspense } from 'react'
import { useParams } from 'react-router'

import { List as SharedList } from '../../../shared/List/index.tsx'
import { Menu } from './Menu.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { useApNavData } from '../../../../modules/useApNavData.ts'

export const List = () => {
  const params = useParams<{ projId: string }>()
  const navData = useApNavData(params)

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        navData={navData}
        MenuBarComponent={Menu}
      />
    </Suspense>
  )
}
