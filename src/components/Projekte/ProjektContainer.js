// @flow
import React, { useContext } from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import { observer } from 'mobx-react-lite'

// when Karte was loaded async, it did not load,
// but only in production!
import Karte from './Karte'
import ErrorBoundary from '../shared/ErrorBoundary'
import TreeContainer from './TreeContainer'
import Daten from './Daten'
import Exporte from './Exporte'
import mobxStoreContext from '../../mobxStoreContext'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  @media print {
    display: block;
    height: auto !important;
  }
`

const enhance = compose(observer)

const ProjekteContainer = ({
  treeName,
  tabs: tabsPassed,
  projekteTabs,
}: {
  treeName: String,
  tabs: Array<String>,
  projekteTabs: Array<String>,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { isPrint } = mobxStore

  //console.log('ProjektContainer rendering')
  if (isPrint) {
    return <Daten treeName={treeName} />
  }

  // remove 2 to treat all same
  const tabs = [...tabsPassed].map(t => t.replace('2', ''))
  const treeFlex =
    projekteTabs.length === 2 && tabs.length === 2
      ? 0.33
      : tabs.length === 0
      ? 1
      : 1 / tabs.length

  return (
    <Container>
      <ErrorBoundary>
        <ReflexContainer orientation="vertical">
          {tabs.includes('tree') && (
            <ReflexElement
              flex={treeFlex}
              propagateDimensions={true}
              renderOnResizeRate={100}
              renderOnResize={true}
            >
              <TreeContainer treeName={treeName} />
            </ReflexElement>
          )}
          {tabs.includes('tree') && tabs.includes('daten') && (
            <ReflexSplitter />
          )}
          {tabs.includes('daten') && (
            <ReflexElement
              propagateDimensions={true}
              renderOnResizeRate={100}
              renderOnResize={true}
            >
              <Daten treeName={treeName} />
            </ReflexElement>
          )}
          {tabs.includes('karte') &&
            (tabs.includes('tree') || tabs.includes('daten')) && (
              <ReflexSplitter />
            )}
          {tabs.includes('karte') && (
            <ReflexElement
              className="karte"
              propagateDimensions={true}
              renderOnResizeRate={200}
              renderOnResize={true}
            >
              <Karte treeName={treeName} />
            </ReflexElement>
          )}
          {tabs.includes('exporte') &&
            (tabs.includes('tree') ||
              tabs.includes('daten') ||
              tabs.includes('karte')) && <ReflexSplitter />}
          {tabs.includes('exporte') && (
            <ReflexElement>
              <Exporte />
            </ReflexElement>
          )}
        </ReflexContainer>
      </ErrorBoundary>
    </Container>
  )
}

export default enhance(ProjekteContainer)
