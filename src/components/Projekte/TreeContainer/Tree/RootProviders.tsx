// dynamic hook calls (the root fetchers) are not compiler-analyzable
'use no memo'

import { useEffect, useRef } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useAtomValue, useSetAtom } from 'jotai'
import { isEqual } from 'es-toolkit'

import { userAtom } from '../../../../store/index.ts'
import { setTreeRootMenusAtom } from './virtualTreeAtoms.ts'
import { useProjektNavData } from '../../../../modules/useProjektNavData.ts'
import { useUsersNavData } from '../../../../modules/useUsersNavData.ts'
import { useWertesNavData } from '../../../../modules/useWertesNavData.ts'
import { useMessagesNavData } from '../../../../modules/useMessagesNavData.ts'
import { useCurrentissuesNavData } from '../../../../modules/useCurrentissuesNavData.ts'
import type { TreeMenu } from './types.ts'

interface RegisterRootMenuProps {
  slot: string
  fetcher: () => TreeMenu | undefined
}

/**
 * Calls a root fetcher and registers its navData as a root menu.
 * Renders nothing.
 */
const RegisterRootMenu = ({ slot, fetcher }: RegisterRootMenuProps) => {
  const navData = fetcher()

  const setRootMenu = useSetAtom(setTreeRootMenusAtom)
  const prevMenu = useRef<TreeMenu | null | undefined>(null)

  useEffect(() => {
    if (isEqual(prevMenu.current, navData)) return
    prevMenu.current = navData
    if (navData) setRootMenu({ key: slot, menu: navData })
  })

  return null
}

/**
 * Registers the tree's root menus. These hooks run statically here, like
 * Root/RootNode did before. The users fetcher must keep running in this
 * file (not via dynamic import) or its filter lags by an event.
 */
export const RootProviders = () => {
  const user = useAtomValue(userAtom)
  const token = user?.token
  const role = token ? jwtDecode<{ role?: string }>(token).role : null

  return (
    <>
      <RegisterRootMenu slot="projekt" fetcher={useProjektNavData} />
      <RegisterRootMenu slot="users" fetcher={useUsersNavData} />
      {role === 'apflora_manager' && (
        <RegisterRootMenu slot="wertes" fetcher={useWertesNavData} />
      )}
      <RegisterRootMenu slot="messages" fetcher={useMessagesNavData} />
      <RegisterRootMenu slot="currentissues" fetcher={useCurrentissuesNavData} />
    </>
  )
}
