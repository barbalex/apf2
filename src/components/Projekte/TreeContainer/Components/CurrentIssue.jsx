import { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../Tree/Row'
import getNode from '../nodes/currentIssuesFolder'
import storeContext from '../../../../storeContext'

const CurrentIssueNode = ({ treeQueryVariables, count, isLoading }) => {
  const store = useContext(storeContext)

  const [node, setNode] = useState()
  useEffect(() => {
    getNode({ treeQueryVariables, count, isLoading, store }).then((node) =>
      setNode(node),
    )
  }, [count, isLoading, store, treeQueryVariables])

  if (!node) return null

  return <Row node={node} />
}

export default observer(CurrentIssueNode)
