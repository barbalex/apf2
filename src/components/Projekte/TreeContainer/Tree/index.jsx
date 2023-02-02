import React, { useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import jwtDecode from 'jwt-decode'

import Components from './Components'

import storeContext from '../../../../storeContext'

const Container = styled.div`
  height: calc(100% - 53px - 8px);
  width: 100%;
  overflow: auto;

  ul {
    margin: 0;
    list-style: none;
    padding: 0 0 0 1.1em;
  }
`

const TreeComponent = () => {
  const store = useContext(storeContext)
  const { user } = store
  const { refetcher } = store.tree
  const { token } = user
  const role = token ? jwtDecode(token).role : null

  // const lastTouchedNode = lastTouchedNodeProxy?.slice()
  // // when loading on url, lastTouchedNode may not be set
  // const urlToFocus = lastTouchedNode.length ? lastTouchedNode : activeNodeArray
  // const [initialTopMostIndex, setInitialTopMostIndex] = useState(undefined)
  // useEffect(() => {
  //   const index = findIndex(treeNodes, (node) => isEqual(node.url, urlToFocus))
  //   const indexToSet = index === -1 ? 0 : index
  //   if (initialTopMostIndex === undefined) {
  //     setInitialTopMostIndex(indexToSet)
  //   }
  // }, [treeNodes, urlToFocus, initialTopMostIndex])

  //console.log('Tree, height:', { height, initialTopMostIndex })

  return (
    <Container>
      <Components role={role} />
    </Container>
  )
}

export default observer(TreeComponent)
