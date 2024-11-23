import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import { useLocation, Link } from 'react-router-dom'

import { isMobilePhone } from '../../../modules/isMobilePhone.js'
import { HomeMenus } from './Home.jsx'
import { EkPlanMenus } from './EkPlan.jsx'
import { ProjekteMenus } from './Projekte/index.jsx'
import { DocsMenus } from './Docs.jsx'

export const SiteTitle = styled(Button)`
  display: none !important;
  color: white !important;
  font-size: 1em !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  border-width: 0 !important;
  text-transform: none !important;
  white-space: nowrap !important;

  @media (min-width: 1130px) {
    display: block !important;
  }
  :hover {
    border-width: 1px !important;
  }
`
export const MenuDiv = styled.div`
  display: flex;
  flex-wrap: nowrap;
`

export const Bar = () => {
  const isMobile = isMobilePhone()

  const { search, pathname } = useLocation()
  const showHome = pathname === '/'
  const showEkPlan = pathname.includes('/EK-Planung')
  // const showProjekte = pathname.startsWith('/Daten') && !showEkPlan
  const showDocs = pathname.startsWith('/Dokumentation')

  return (
    <>
      {!isMobile && (
        <SiteTitle
          variant="outlined"
          component={Link}
          to={`/${search}`}
          title="Home"
        >
          AP Flora
        </SiteTitle>
      )}
      <MenuDiv>
        {showHome ?
          <HomeMenus />
        : showDocs ?
          <DocsMenus />
        : showEkPlan ?
          <EkPlanMenus />
        : <ProjekteMenus />}
      </MenuDiv>
    </>
  )
}
