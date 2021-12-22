import React from 'react'
import styled from 'styled-components'
import SimpleBar from 'simplebar-react'
import Button from '@mui/material/Button'

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
export const DownloadCardButton = styled(Button)`
  flex-basis: 450px;
  text-transform: none !important;
  font-weight: 500;
  display: block;
  text-align: left;
  justify-content: flex-start !important;
  user-select: none;
`
export const StyledProgressText = styled.span`
  margin-left: 10px;
  font-style: italic;
  animation: blinker 1s linear infinite;
  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
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
