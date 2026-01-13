import { Suspense } from 'react'

import { List as SharedList } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.tsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { useTpopmassnNavData } from '../../../../modules/useTpopmassnNavData.js'

export const List = () => {
  const { navData, error } = useTpopmassnNavData()

  if (error) return <Error error={error} />

  return (
    <Suspense fallback={<Spinner />}>
      <SharedList
        navData={navData}
        MenuBarComponent={Menu}
        menuBarProps={{ row: navData }}
      />
    </Suspense>
  )
}
