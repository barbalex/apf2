import { memo, useState, useEffect } from 'react'

import { ChildlessFolderTransitioned } from './ChildlessFolderTransitioned.jsx'

export const BeobNichtZuzuordnens = memo(({ menu, in: inProp }) => {
  const { fetcherName, fetcherParams } = menu

  const [fetcherModule, setFetcherModule] = useState(null)

  useEffect(() => {
    // return the module, not the hook as that would already be called
    import(`../../../modules/${fetcherName}.js`).then((module) => {
      setFetcherModule(module)
    })
  }, [fetcherName])

  const { navData, isLoading, error } =
    fetcherModule?.[fetcherName]?.(fetcherParams)

  return navData.menus.map((menu) => (
    <ChildlessFolderTransitioned
      key={menu.id}
      menu={menu}
      inProp={inProp}
    />
  ))
})
