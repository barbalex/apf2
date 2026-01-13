import { useState, useEffect } from 'react'

import { NodeWithListTransitioned } from '../NodeWithListTransitioned.tsx'
import { NodeWithList } from '../NodeWithList.tsx'

export const Fetcher = ({
  menu,
  inProp,
  parentTransitionState,
  fetcherModule,
}) => {
  const { fetcherName, fetcherParams } = menu

  const result = fetcherModule?.[fetcherName]?.(fetcherParams)

  const navData = result?.navData
  const error = result?.error

  if (error) {
    console.log('TableFolder.Fetcher, error:', error)
    return null
  }
  // do not want to show self i.e. 'Massnahme' in 'Massnahmen'
  const menus = navData?.menus?.filter?.((m) => !m.isSelf)

  if (!menus?.length) return null

  // console.log('TableFolder.Fetcher', {
  //   navData,
  //   menu,
  //   inProp,
  //   menus: navData.menus,
  // })

  if (inProp === undefined) {
    return menus.map((m) => (
      <NodeWithList
        key={m.id}
        menu={m}
        parentTransitionState={parentTransitionState}
      />
    ))
  }

  return menus.map((m) => (
    <NodeWithListTransitioned
      key={m.id}
      menu={m}
      inProp={inProp}
      parentTransitionState={parentTransitionState}
    />
  ))
}
