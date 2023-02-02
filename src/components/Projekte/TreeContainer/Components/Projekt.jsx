import { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../Tree/Row'
import getNode from '../nodes/projekt'
import storeContext from '../../../../storeContext'

const ProjektNode = ({ treeQueryVariables, projekt, isProjectOpen }) => {
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

  if (!isProjectOpen) {
    return <Row node={node} />
  }

  // TODO:
  // add apFolder and apberuebersichtFolder
  // const apFolderNode = await apFolder({
  //   projId: projekt.id,
  //   store,
  //   treeQueryVariables,
  //   count: projekt?.apsByProjId?.totalCount ?? 0,
  // })
  // const apberUebersichtFolderNode = await apberuebersichtFolder({
  //   projId: projekt.id,
  //   store,
  //   count: projekt?.apberuebersichtsByProjId?.totalCount ?? 0,
  //   treeQueryVariables,
  // })
  // const children = store.tree.openProjekts.includes(projekt.id)
  //   ? [apFolderNode, apberUebersichtFolderNode]
  //   : []

  return (
    <>
      <Row node={node} />
    </>
  )
}

export default observer(ProjektNode)
