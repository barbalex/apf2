import { NodeWithListTransitioned } from '../NodeWithListTransitioned.tsx'
import { NodeWithList } from '../NodeWithList.tsx'
import type { TransitionStatus } from 'react-transition-group'

import type { TreeMenu, FetcherModule } from '../types.ts'

interface FetcherProps {
  menu: TreeMenu
  inProp?: boolean | undefined
  parentTransitionState?: TransitionStatus | undefined
  fetcherModule: FetcherModule | null
}

export const Fetcher = ({
  menu,
  inProp,
  parentTransitionState,
  fetcherModule,
}: FetcherProps) => {
  const { fetcherName, fetcherParams } = menu

  // menus reaching the Fetcher always provide a fetcherName
  const navData = fetcherModule?.[fetcherName as string]?.(fetcherParams)

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
