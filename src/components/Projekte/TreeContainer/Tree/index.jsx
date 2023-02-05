// import { useContext } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import Root from './Root'
import IntoViewScroller from './IntoViewScroller'

// import storeContext from '../../../../storeContext'

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
  // TODO: needed?
  // const store = useContext(storeContext)
  // const { refetcher } = store.tree

  return (
    <Container>
      <Root />
      <IntoViewScroller />
    </Container>
  )
}

export default observer(TreeComponent)
