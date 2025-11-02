import { useRef } from 'react'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import { useLocation, Link } from 'react-router'
import { useAtom } from 'jotai'

import { HomeMenus } from './Home/index.jsx'
import { EkPlanMenus } from './EkPlan.jsx'
import { ProjekteMenus } from './Projekte/index.jsx'
import { isMobileViewAtom } from '../../../JotaiStore/index.js'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  overflow: hidden;

  @media (max-width: 1040px) {
    justify-content: flex-end;
  }
`
const SiteTitle = styled(Button)`
  display: ${(props) => (props.hide === 'true' ? 'none' : 'block')} !important;
  max-width: 110px;
  flex-grow: 0;
  flex-shrink: 1;
  color: white !important;
  font-size: 1em !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  border-width: 0 !important;
  text-transform: none !important;
  white-space: nowrap !important;

  :hover {
    border-width: 1px !important;
  }

  @media (max-width: 1040px) {
    transform: translateX(-9999px);
    // need to take hidden elements out of flow
    position: absolute;
  }
`
const MenuDiv = styled.div`
  display: flex;
  flex-wrap: nowrap;
  flex-grow: 1;
  justify-content: flex-end;
  overflow: hidden;
`

export const Bar = () => {
  const { search, pathname } = useLocation()
  const showHome = pathname === '/' || pathname.startsWith('/Dokumentation')
  const showEkPlan = pathname.includes('/EK-Planung')

  const [isMobileView] = useAtom(isMobileViewAtom)

  const menuDivRef = useRef(null)
  const menuDivWidth = menuDivRef.current?.offsetWidth ?? 0

  return (
    <Container>
      <SiteTitle
        variant="outlined"
        component={Link}
        to={`/${search}`}
        title="Home"
      >
        AP Flora
      </SiteTitle>
      <MenuDiv ref={menuDivRef}>
        {showHome ?
          <HomeMenus />
        : showEkPlan ?
          <EkPlanMenus />
        : <ProjekteMenus />}
      </MenuDiv>
    </Container>
  )
}
