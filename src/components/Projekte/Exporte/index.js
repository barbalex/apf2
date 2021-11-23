import React from 'react'
import styled from 'styled-components'
import SimpleBar from 'simplebar-react'

import FormTitle from '../../shared/FormTitle'
import Tipps from './Tipps'
import Ap from './Ap'
import Populationen from './Populationen'
import Teilpopulationen from './Teilpopulationen'
import Kontrollen from './Kontrollen'
import Massnahmen from './Massnahmen'
import Beobachtungen from './Beobachtungen'
import Anwendung from './Anwendung'
import Optionen from './Optionen'
import ErrorBoundary from '../../shared/ErrorBoundary'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  @media print {
    display: none !important;
  }
`
const ScrollContainer = styled.div`
  overflow-y: auto;
`
const InnerContainer = styled.div`
  padding: 10px;
`
const ExporteContainer = styled.div`
  height: 100%;
`

const Exporte = () => {
  return (
    <ExporteContainer data-id={`exporte-container`}>
      <ErrorBoundary>
        <Container>
          <FormTitle title="Exporte" treeName="tree" />
          <ScrollContainer>
            <SimpleBar
              style={{
                maxHeight: '100%',
                height: '100%',
              }}
            >
              <InnerContainer>
                <Optionen />
                <Tipps />
                <Ap />
                <Populationen />
                <Teilpopulationen />
                <Kontrollen />
                <Massnahmen />
                <Beobachtungen />
                <Anwendung />
              </InnerContainer>
            </SimpleBar>
          </ScrollContainer>
        </Container>
      </ErrorBoundary>
    </ExporteContainer>
  )
}

export default Exporte
