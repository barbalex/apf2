import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../Row.jsx'
import { ApberuebersichtFolder } from './ApberuebersichtFolder/index.jsx'
import { ApFolder } from './ApFolder/index.jsx'
import { useProjektNavData } from '../../../../../../modules/useProjektNavData.js'
import { StoreContext } from '../../../../../../storeContext.js'

export const Projekt = memo(
  observer(({ projekt, projectIsOpen }) => {
    const store = useContext(StoreContext)
    const { apGqlFilterForTree, apberuebersichtGqlFilterForTree } = store.tree
    const { navData, isLoading, error } = useProjektNavData({
      projId: projekt?.id,
      apGqlFilterForTree,
      apberuebersichtGqlFilterForTree,
    })
    console.log('Tree/Root/Projekt', { navData })
    const url = ['Projekte', projekt.id]
    const node = {
      nodeType: 'table',
      menuType: 'projekt',
      id: projekt.id,
      urlLabel: projekt.id,
      label: projekt.label,
      url,
      hasChildren: true,
    }

    return (
      <>
        <Row node={node} />
        {projectIsOpen && (
          <>
            <ApFolder
              projekt={projekt}
              count={projekt?.apsByProjId?.totalCount ?? 0}
              countFiltered={projekt?.apsFiltered?.totalCount ?? 0}
              isLoading={isLoading}
            />
            <ApberuebersichtFolder
              projekt={projekt}
              count={projekt?.apberuebersichtsByProjId?.totalCount ?? 0}
              countFiltered={projekt?.filteredApberuebersichts?.totalCount ?? 0}
              isLoading={isLoading}
            />
          </>
        )}
      </>
    )
  }),
)
