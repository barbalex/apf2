import React from 'react'
import styled from 'styled-components'
import SimpleBar from 'simplebar-react'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'

import FormTitle from '../../shared/FormTitle'
import Tipps from './Tipps'
import Ap from './Ap'
import PopulationenExports from './Populationen'
import Teilpopulationen from './Teilpopulationen'
import Kontrollen from './Kontrollen'
import MassnahmenExporte from './Massnahmen'
import BeobachtungenExports from './Beobachtungen'
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
  white-space: nowrap;
  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
`
export const StyledProgressTextNewLine = styled.div`
  font-style: italic;
  animation: blinker 1s linear infinite;
  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
`
export const StyledCardContent = styled(CardContent)`
  margin: -15px 0 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: stretch;
  align-content: stretch;
`
export const CardActionTitle = styled.div`
  padding-left: 8px;
  font-weight: bold;
  word-break: break-word;
  user-select: none;
`
export const StyledCard = styled(Card)`
  margin: 10px 0;
  background-color: #fff8e1 !important;
`
export const StyledCardActions = styled(CardActions)`
  justify-content: space-between;
  cursor: pointer;
  height: auto !important;
`
export const CardActionIconButton = styled(IconButton)`
  transform: ${(props) => (props['data-expanded'] ? 'rotate(180deg)' : 'none')};
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
                <PopulationenExports />
                <Teilpopulationen />
                <Kontrollen />
                <MassnahmenExporte />
                <BeobachtungenExports />
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
