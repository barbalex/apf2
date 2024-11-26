import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import { useLocation, Link } from 'react-router'

const StyledButton = styled(Button)`
  color: white !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  text-transform: none !important;
  width: ${(props) => `${props.width}px` ?? 'unset'} !important;
`
export const DocsMenus = () => {
  const { pathname, search } = useLocation()

  return [
    <StyledButton
      key="artenBearbeiten"
      variant="text"
      component={Link}
      to={`/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13${search}`}
      width={140}
    >
      Arten bearbeiten
    </StyledButton>,
    <StyledButton
      key="dokumentation"
      variant={pathname.startsWith('/Dokumentation') ? 'outlined' : 'text'}
      component={Link}
      to={`/Dokumentation/${search}`}
      width={145}
    >
      Dokumentation
    </StyledButton>,
  ]
}
