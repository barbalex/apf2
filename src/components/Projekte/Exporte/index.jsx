import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import IconButton from '@mui/material/IconButton'

import { FormTitle } from '../../shared/FormTitle/index.jsx'
import { Ap } from './Ap/index.jsx'
import { Beobachtungen } from './Beobachtungen/index.jsx'
import { Kontrollen } from './Kontrollen/index.jsx'
import { Massnahmen } from './Massnahmen/index.jsx'
import { Populationen } from './Populationen/index.jsx'
import { Teilpopulationen } from './Teilpopulationen/index.jsx'
import { Tipps } from './Tipps/index.jsx'
import { Anwendung } from './Anwendung.jsx'
import { Optionen } from './Optionen.jsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'

import {
  container,
  scrollContainer,
  innerContainer,
  exporteContainer,
} from './index.module.css'

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

export const Exporte = () => (
  <div
    className={exporteContainer}
    data-id="exporte-container"
  >
    <ErrorBoundary>
      <div className={container}>
        <FormTitle
          title="Exporte"
          noTestDataMessage={true}
        />
        <div className={scrollContainer}>
          <div className={innerContainer}>
            <Optionen />
            <Tipps />
            <Ap />
            <Populationen />
            <Teilpopulationen />
            <Kontrollen />
            <Massnahmen />
            <Beobachtungen />
            <Anwendung />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  </div>
)
