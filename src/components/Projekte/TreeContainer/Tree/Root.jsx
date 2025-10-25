import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { jwtDecode } from 'jwt-decode'

import { MobxContext } from '../../../../mobxContext.js'
import { NodeWithList } from './NodeWithList.jsx'
import { RootNode } from './RootNode.jsx'
import { useProjektNavData } from '../../../../modules/useProjektNavData.js'
import { useUsersNavData } from '../../../../modules/useUsersNavData.js'
import { useWertesNavData } from '../../../../modules/useWertesNavData.js'
import { useMessagesNavData } from '../../../../modules/useMessagesNavData.js'
import { useCurrentissuesNavData } from '../../../../modules/useCurrentissuesNavData.js'

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
