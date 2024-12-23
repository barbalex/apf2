import { memo, useState, useEffect } from 'react'

import { NodeTransitioned } from '../NodeTransitioned.jsx'

export const Fetcher = memo(({ menu, inProp, fetcherModule }) => {
  const { fetcherName, fetcherParams } = menu

  const result = fetcherModule?.[fetcherName]?.(fetcherParams)

  const navData = result?.navData
  const isLoading = result?.isLoading
  const error = result?.error

  if (error) {
    console.log('TableFolder.Fetcher, error:', error)
    return null
  }
  if (!navData?.menus?.length) return null

  // console.log('TableFolder.Fetcher', {
  //   navData,
  //   isLoading,
  //   error,
  //   menu,
  //   inProp,
  //   menus: navData.menus,
  // })

  return navData.menus.map((m) => (
    <NodeTransitioned
      key={m.id}
      menu={m}
      inProp={inProp}
    />
  ))
})
