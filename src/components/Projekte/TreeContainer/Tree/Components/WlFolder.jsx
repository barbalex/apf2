import { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../Row'
import getNode from '../../nodes/wlFolder'
import storeContext from '../../../../../storeContext'

const WlFolderNode = ({ treeQueryVariables }) => {
  const store = useContext(storeContext)

  const [node, setNode] = useState()
  useEffect(() => {
    getNode({ treeQueryVariables, store }).then((node) => setNode(node))
  }, [store, treeQueryVariables])

  if (!node) return null

  return <Row node={node} />
}

export default observer(WlFolderNode)
