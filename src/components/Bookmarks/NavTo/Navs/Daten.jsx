import { memo } from 'react'

import { useRootNavData } from '../../../../modules/useRootNavData.js'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Nav } from '../Nav.jsx'

export const Menu = memo(() => {
  const { navData, isLoading, error } = useRootNavData()

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  return navData.menus.map((item, index) => (
    <Nav
      key={item.id}
      item={item}
      baseUrl={navData.url}
      needsBorderRight={index < navData.menus.length - 1}
    />
  ))
})
