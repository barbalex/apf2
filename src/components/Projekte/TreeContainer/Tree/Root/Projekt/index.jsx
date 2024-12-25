import { memo } from 'react'

import { Row } from '../../Row.jsx'
import { ApberuebersichtFolder } from './ApberuebersichtFolder/index.jsx'
import { ApFolder } from './ApFolder/index.jsx'
import { NodeListFolder } from '../../NodeListFolder.jsx'
import { useProjektNavData } from '../../../../../../modules/useProjektNavData.js'
import { nodeFromMenu } from '../../nodeFromMenu.js'

export const Projekt = memo(({ projekt, isLoading, projectIsOpen }) => {
  const { navData } = useProjektNavData({ projId: projekt.id })
  const node = nodeFromMenu(navData)

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
})
