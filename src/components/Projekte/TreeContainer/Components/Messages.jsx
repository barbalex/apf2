import { useEffect, useState } from 'react'

import Row from '../Tree/Row'
import getNode from '../nodes/messagesFolder'

const MessagesNode = ({ count, isLoading }) => {
  const [node, setNode] = useState()
  useEffect(() => {
    getNode({ count, isLoading }).then((node) => setNode(node))
  }, [count, isLoading])

  if (!node) return null

  return <Row node={node} />
}

export default MessagesNode
