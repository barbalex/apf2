import { Suspense } from 'react'

import { useRootNavData } from '../../../../modules/useRootNavData.ts'
import { Spinner } from '../../../shared/Spinner.tsx'
import { Nav } from '../Nav.tsx'

export const Menu = () => {
  const navData = useRootNavData()

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
