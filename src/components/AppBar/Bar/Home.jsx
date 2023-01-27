import React from 'react'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import { useLocation, Link } from 'react-router-dom'

const StyledButton = styled(Button)`
  color: white !important;
  text-transform: none !important;
`
const HomeBar = () => {
  const { pathname, search } = useLocation()

  return (
    <>
      <StyledButton
        variant="text"
        component={Link}
        to={`/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13${search}`}
      >
        Arten bearbeiten
      </StyledButton>
      <StyledButton
        variant={pathname.startsWith('/Dokumentation') ? 'outlined' : 'text'}
        component={Link}
        to={`/Dokumentation/${search}`}
      >
        Dokumentation
      </StyledButton>
    </>
  )
}

export default HomeBar
