import { memo, useState, useEffect } from 'react'

import { ChildlessFolderTransitioned } from '../ChildlessFolderTransitioned.jsx'

export const Fetcher = memo(({ menu, inProp, fetcherModule }) => {
  const { fetcherName, fetcherParams } = menu

  const result = fetcherModule?.[fetcherName]?.(fetcherParams)

  const navData = result?.navData
  const isLoading = result?.isLoading
  const error = result?.error

  if (isLoading) return null
  if (error) return null
  if (!navData?.menus?.length) return null

  return navData.menus.map((menuu) => (
    <ChildlessFolderTransitioned
      key={menuu.id}
      menu={menuu}
      inProp={inProp}
    />
  ))
})
