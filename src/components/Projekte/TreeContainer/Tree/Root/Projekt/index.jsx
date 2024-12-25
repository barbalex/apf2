import { memo, useMemo } from 'react'

import { Row } from '../../Row.jsx'
import { ApFolder } from './ApFolder/index.jsx'
import { NodeListFolder } from '../../NodeListFolder.jsx'
import { useProjektNavData } from '../../../../../../modules/useProjektNavData.js'
import { nodeFromMenu } from '../../nodeFromMenu.js'
import { apber } from '../../../../../shared/fragments.js'

export const Projekt = memo(({ projekt, isLoading, projectIsOpen }) => {
  const { navData } = useProjektNavData({ projId: projekt.id })
  const node = nodeFromMenu(navData)
  const apberuebersichtMenu = useMemo(
    () => navData?.menus?.find?.((menu) => menu.id === 'AP-Berichte'),
    [navData],
  )

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
          <NodeListFolder menu={apberuebersichtMenu} />
        </>
      )}
    </>
  )
})
