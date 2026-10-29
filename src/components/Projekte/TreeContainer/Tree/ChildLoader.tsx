// dynamic hook calls (the fetcher modules) are not compiler-analyzable
'use no memo'

import { useEffect, useState, Suspense } from 'react'
import { useRef } from 'react'
import { useSetAtom } from 'jotai'
import { isEqual } from 'es-toolkit'

import { setTreeChildrenMenusAtom } from './virtualTreeAtoms.ts'
import type { TreeMenu, FetcherModule } from './types.ts'

interface RegisterChildrenProps {
  menu: TreeMenu
  fetcherModule: FetcherModule
}

/**
 * Calls the folder's fetcher hook (like NodesList/Fetcher did) and registers
 * the resulting menus in the children registry. Renders nothing.
 */
const RegisterChildren = ({ menu, fetcherModule }: RegisterChildrenProps) => {
  const { fetcherName, fetcherParams } = menu

  // menus reaching here always provide a fetcherName
  const navData = fetcherModule?.[fetcherName as string]?.(fetcherParams)

  // same filter Fetcher applied: do not show self i.e. 'Massnahme' in 'Massnahmen'
  const menus = navData?.menus?.filter?.((m) => !m.isSelf)
  const children = menus ?? []

  const setChildren = useSetAtom(setTreeChildrenMenusAtom)
  const prevChildren = useRef<TreeMenu[] | null>(null)

  useEffect(() => {
    if (isEqual(prevChildren.current, children)) return
    prevChildren.current = children
    setChildren({
      key: JSON.stringify(menu.treeUrl),
      menus: children,
    })
  })

  return null
}

interface ChildLoaderProps {
  menu: TreeMenu
}

/**
 * Loads the children of an open folder: dynamically imports the fetcher
 * module, then lets RegisterChildren call the hook and register the menus.
 * Renders nothing. Mounts only for rows inside the virtualized window.
 */
export const ChildLoader = ({ menu }: ChildLoaderProps) => {
  const { fetcherName } = menu

  const [fetcherModule, setFetcherModule] = useState<FetcherModule | null>(null)

  useEffect(() => {
    // return the module, not the hook as that would already be called
    void import(`../../../../modules/${fetcherName}.ts`).then(
      (module: FetcherModule) => {
        setFetcherModule(module)
      },
    )
  }, [fetcherName])

  if (!fetcherModule) return null

  return (
    <Suspense fallback={null}>
      <RegisterChildren menu={menu} fetcherModule={fetcherModule} />
    </Suspense>
  )
}
