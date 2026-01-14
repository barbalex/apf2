import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { jwtDecode } from 'jwt-decode'

import { MobxContext } from '../../../../mobxContext.ts'
import { NodeWithList } from './NodeWithList.tsx'
import { RootNode } from './RootNode.tsx'
import { useProjektNavData } from '../../../../modules/useProjektNavData.ts'
import { useUsersNavData } from '../../../../modules/useUsersNavData.ts'
import { useWertesNavData } from '../../../../modules/useWertesNavData.ts'
import { useMessagesNavData } from '../../../../modules/useMessagesNavData.ts'
import { useCurrentissuesNavData } from '../../../../modules/useCurrentissuesNavData.ts'

export const Root = observer(() => {
  const store = useContext(MobxContext)
  const token = store.user?.token
  const role = token ? jwtDecode(token).role : null

  return (
    <>
      <RootNode fetcher={useProjektNavData} />
      <RootNode fetcher={useUsersNavData} />
      {role === 'apflora_manager' && <RootNode fetcher={useWertesNavData} />}
      <RootNode fetcher={useMessagesNavData} />
      <RootNode fetcher={useCurrentissuesNavData} />
    </>
  )
})
