import { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../Tree/Row'
import getProjectNode from '../nodes/projekt'
import storeContext from '../../../../storeContext'

const ProjektNode = ({ treeQueryVariables, projekt, isProjectOpen }) => {
  const store = useContext(storeContext)

  const [node, setNode] = useState()
  useEffect(() => {
    getProjectNode({ treeQueryVariables, projekt, isProjectOpen, store }).then(
      (node) => setNode(node),
    )
  }, [isProjectOpen, projekt, store, treeQueryVariables])

  if (!node) return null

  return <Row node={node} />
}

export default observer(ProjektNode)
