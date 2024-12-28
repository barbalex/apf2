import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { jwtDecode } from 'jwt-decode'

import { Projekt } from './Projekt/index.jsx'
import { MobxContext } from '../../../../../mobxContext.js'
import { NodeWithList } from '../NodeWithList.jsx'
import { RootNode } from '../RootNode.jsx'
import { useUsersNavData } from '../../../../../modules/useUsersNavData.js'
import { useMessagesNavData } from '../../../../../modules/useMessagesNavData.js'
import { useProjektNavData } from '../../../../../modules/useProjektNavData.js'
import { useCurrentissuesNavData } from '../../../../../modules/useCurrentissuesNavData.js'
import { useWertesNavData } from '../../../../../modules/useWertesNavData.js'

export const Root = memo(
  observer(() => {
    

    const store = useContext(MobxContext)
    const token = store.user?.token
    const role = token ? jwtDecode(token).role : null




    return (
      <>
        {/* <Projekt
          projekt={data?.data?.allProjekts?.nodes?.[0]}
          isLoading={isLoading}
          projectIsOpen={projectIsOpen}
        /> */}
        {/* TODO: renders twice, on second render fetcher is undefined. IMPOSSIBLE */}
        <RootNode fetcher={useProjektNavData} />
        <RootNode fetcher={useUsersNavData} />
        {role === 'apflora_manager' && <RootNode fetcher={useWertesNavData} />}
        <RootNode fetcher={useMessagesNavData} />
        <RootNode fetcher={useCurrentissuesNavData} />
      </>
    )
  }),
)
