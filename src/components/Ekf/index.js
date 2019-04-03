// @flow
/**
 * Stopped lazy loading Tpopfreiwkontr
 * because Reflex would often not show layout
 */
import React, { useContext } from 'react'
import styled from 'styled-components'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import jwtDecode from 'jwt-decode'
import { observer } from 'mobx-react-lite'

// when Karte was loaded async, it did not load,
// but only in production!
import ErrorBoundary from '../shared/ErrorBoundary'
import EkfList from './ListContainer'
import Tpopfreiwkontr from '../Projekte/Daten/Tpopfreiwkontr'
import mobxStoreContext from '../../mobxStoreContext'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  @media print {
    display: block;
    height: auto !important;
  }
`
const ReflexElementForEKF = styled(ReflexElement)`
  > div {
    border-left: 1px solid rgb(46, 125, 50);
  }
`

const Ekf = () => {
  const { user, isPrint, tree } = useContext(mobxStoreContext)
  const { token } = user
  const tokenDecoded = token ? jwtDecode(token) : null
  const role = tokenDecoded ? tokenDecoded.role : null

  const { activeNodeArray } = tree
  const tpopkontrId =
    activeNodeArray.length > 9
      ? activeNodeArray[9]
      : '99999999-9999-9999-9999-999999999999'
  const treeName = 'tree'

  if (isPrint && tpopkontrId) {
    return (
      <Tpopfreiwkontr
        treeName={treeName}
        role={role}
        dimensions={{ width: 1000 }}
      />
    )
  }

  return (
    <Container>
      <ErrorBoundary>
        <ReflexContainer orientation="vertical">
          <ReflexElement
            flex={0.33}
            propagateDimensions={true}
            propagateDimensionsRate={800}
          >
            <EkfList />
          </ReflexElement>
          <ReflexSplitter />
          <ReflexElementForEKF
            flex={0.67}
            propagateDimensions={true}
            propagateDimensionsRate={800}
          >
            {tpopkontrId && (
              <Tpopfreiwkontr
                treeName={treeName}
                role={role}
                dimensions={{ width: 1000 }}
              />
            )}
          </ReflexElementForEKF>
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default observer(Ekf)
