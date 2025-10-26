import { Suspense } from 'react'

import { useRootNavData } from '../../../../modules/useRootNavData.js'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Nav } from '../Nav.jsx'

export const Menu = () => {
  const { navData, error } = useRootNavData()

  if (error) return <Error error={error} />

  return (
    <Suspense fallback={<Spinner />}>
      {navData.menus.map((item, index) => (
        <Nav
          key={item.id}
          item={item}
          baseUrl={navData.url}
          needsBorderRight={index < navData.menus.length - 1}
        />
      ))}
    </Suspense>
  )
}
