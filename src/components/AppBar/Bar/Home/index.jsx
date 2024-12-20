import { memo } from 'react'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import { useLocation, Link } from 'react-router'
import { useAtom } from 'jotai'

import { Dokumentation } from './Dokumentation.jsx'
import { DokumentationMobile } from './DokumentationMobile.jsx'
import { isMobileViewAtom } from '../../../../JotaiStore/index.js'

export const StyledButton = styled(Button)`
  color: white !important;
  ${(props) =>
    props.border === 'true' &&
    'border-color: rgba(255, 255, 255, 0.5) !important;'}
  text-transform: none !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
`

export const HomeMenus = memo(() => {
  const { search } = useLocation()
  const [isMobileView] = useAtom(isMobileViewAtom)

  return (
    <>
      <StyledButton
        variant="text"
        component={Link}
        to={`/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13${search}`}
      >
        Daten
      </StyledButton>
      {isMobileView ?
        <DokumentationMobile />
      : <Dokumentation />}
    </>
  )
})
