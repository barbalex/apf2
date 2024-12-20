import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import { useLocation, Link } from 'react-router'
import { useAtom } from 'jotai'

import { isMobileViewAtom } from '../../../JotaiStore/index.js'

const StyledButton = styled(Button)`
  color: white !important;
  ${(props) =>
    props.border === 'true' &&
    'border-color: rgba(255, 255, 255, 0.5) !important;'}
  text-transform: none !important;
  width: ${(props) => `${props.width}px` ?? 'unset'} !important;
`
export const HomeMenus = () => {
  const { pathname, search } = useLocation()
  const isDocs = pathname.startsWith('/Dokumentation')
  const [isMobileView] = useAtom(isMobileViewAtom)

  return (
    <>
      <StyledButton
        key="artenBearbeiten"
        variant="text"
        component={Link}
        to={`/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13${search}`}
        width={isMobileView ? 70 : 140}
      >
        {isMobileView ? 'Daten' : 'Arten bearbeiten'}
      </StyledButton>
      <StyledButton
        key="dokumentation"
        variant={pathname.startsWith('/Dokumentation') ? 'outlined' : 'text'}
        component={Link}
        to={`/Dokumentation/${search}`}
        width={isMobileView ? 60 : 130}
        border={isDocs.toString()}
      >
        {isMobileView ? 'Doku' : 'Dokumentation'}
      </StyledButton>
    </>
  )
}
