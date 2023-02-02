import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../../Row'
import storeContext from '../../../../../../storeContext'
import Apberuebersicht from './Apberuebersicht'

const ProjektNode = ({
  treeQueryVariables,
  projekt,
  isProjectOpen,
  apberuebersichtsFilter,
}) => {
  const store = useContext(storeContext)

  const node = {
    nodeType: 'table',
    menuType: 'projekt',
    id: projekt.id,
    urlLabel: projekt.id,
    label: projekt.label,
    url: ['Projekte', projekt.id],
    hasChildren: true,
  }

  // TODO:
  // add apFolder and apberuebersichtFolder
  // const apFolderNode = await apFolder({
  //   projId: projekt.id,
  //   store,
  //   treeQueryVariables,
  //   count: projekt?.apsByProjId?.totalCount ?? 0,
  // })
  // const children = store.tree.openProjekts.includes(projekt.id)
  //   ? [apFolderNode, apberUebersichtFolderNode]
  //   : []

  return (
    <>
      <Row node={node} />
      {isProjectOpen && (
        <Apberuebersicht
          projekt={projekt}
          count={projekt?.apberuebersichtsByProjId?.totalCount ?? 0}
          apberuebersichtsFilter={apberuebersichtsFilter}
        />
      )}
    </>
  )
}

export default observer(ProjektNode)
