import React, { useContext, useCallback, useRef, useEffect } from 'react'
import styled from '@emotion/styled'
import SplitPane from 'react-split-pane'
import jwtDecode from 'jwt-decode'
import { observer } from 'mobx-react-lite'

// when Karte was loaded async, it did not load,
// but only in production!
import EkfList from './ListContainer'
import Tpopfreiwkontr from '../Projekte/Daten/Tpopfreiwkontr'
import storeContext from '../../storeContext'

const Container = styled.div`
  height: 100%;
  overflow: hidden;

  @media print {
    display: block;
    height: auto !important;
  }
`
const StyledSplitPane = styled(SplitPane)`
  .Resizer {
    background: #388e3c;
    opacity: 1;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .Resizer:hover {
    -webkit-transition: all 2s ease;
    transition: all 2s ease;
  }

  .Resizer.vertical {
    border-left: 3px solid #388e3c;
    /*border-right: 1.5px solid #388e3c;*/
    cursor: col-resize;
    background-color: #388e3c;
  }

  .Resizer.vertical:hover {
    border-left: 2px solid rgba(0, 0, 0, 0.3);
    border-right: 2px solid rgba(0, 0, 0, 0.3);
  }
  .Resizer.disabled {
    cursor: not-allowed;
  }
  .Resizer.disabled:hover {
    border-color: transparent;
  }
  .Pane {
    overflow: hidden;
  }
`
const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
`

const standardWidth = 500

const Ekf = () => {
  const {
    user,
    isPrint,
    tree,
    ekfIds: ekfIdsRaw,
    ekfMultiPrint,
  } = useContext(storeContext)
  const { token } = user
  const tokenDecoded = token ? jwtDecode(token) : null
  const role = tokenDecoded ? tokenDecoded.role : null

  const { activeNodeArray, setTreeWidth } = tree
  const tpopkontrId =
    activeNodeArray.length > 9
      ? activeNodeArray[9]
      : '99999999-9999-9999-9999-999999999999'
  const tpopkontrIdExists =
    tpopkontrId !== '99999999-9999-9999-9999-999999999999'
  const treeName = 'tree'

  const treeEl = useRef(null)
  const datenEl = useRef(null)

  const setDimensions = useCallback(() => {
    if (treeEl.current && treeEl.current.clientWidth) {
      setTreeWidth(treeEl.current.clientWidth)
    } else {
      setTreeWidth(standardWidth)
    }
  }, [setTreeWidth])

  const onDragFinished = useCallback(() => setDimensions(), [setDimensions])

  // reset dimensions when window resizes
  useEffect(() => {
    typeof window !== 'undefined' &&
      window.addEventListener('resize', setDimensions)
    setDimensions()
    return () =>
      typeof window !== 'undefined' &&
      window.removeEventListener('resize', setDimensions)
  }, [setDimensions])

  const ekfIds = ekfIdsRaw?.toJSON()
  if (isPrint && ekfIds.length > 0 && ekfMultiPrint) {
    return (
      <>
        {ekfIds.map((id) => (
          <Tpopfreiwkontr treeName={treeName} role={role} id={id} key={id} />
        ))}
      </>
    )
  }

  if (isPrint && tpopkontrIdExists) {
    return <Tpopfreiwkontr treeName={treeName} role={role} />
  }

  return (
    <Container>
      <StyledSplitPane
        split="vertical"
        size="33%"
        minSize={100}
        onDragFinished={onDragFinished}
      >
        <InnerContainer ref={treeEl}>
          <EkfList />
        </InnerContainer>
        <InnerContainer ref={datenEl}>
          {tpopkontrIdExists ? (
            <Tpopfreiwkontr treeName={treeName} role={role} />
          ) : (
            <InnerContainer />
          )}
        </InnerContainer>
      </StyledSplitPane>
    </Container>
  )
}

export default observer(Ekf)
