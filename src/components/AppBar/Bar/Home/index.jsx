import { memo } from 'react'
import Button from '@mui/material/Button'
import { useLocation, Link } from 'react-router'
import styled from '@emotion/styled'

import { Dokumentation } from './Dokumentation.jsx'

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

  return (
    <>
      <StyledButton
        variant="text"
        component={Link}
        to={`/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13${search}`}
      >
        Daten
      </StyledButton>
      <Dokumentation />
    </>
  )
})
