import React from 'react'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import { useLocation, Link } from 'react-router-dom'

import isMobilePhone from '../../../modules/isMobilePhone'
import Home from './Home'
import EkPlan from './EkPlan'
import Projekte from './Projekte'
import Docs from './Docs'

const SiteTitle = styled(Button)`
  display: none !important;
  color: white !important;
  font-size: 20px !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  border-width: 0 !important;
  text-transform: none !important;
  @media (min-width: 750px) {
    display: block !important;
  }
  :hover {
    border-width: 1px !important;
  }
`
const MenuDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const AbbBarComponentBar = () => {
  const isMobile = isMobilePhone()

  const { search, pathname } = useLocation()
  const showHome = pathname === '/'
  const showEkPlan = pathname.includes('/EK-Planung')
  const showProjekte = pathname.startsWith('/Daten') && !showEkPlan
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
        <>
          {showHome && <Home />}
          {showEkPlan && <EkPlan />}
          {showProjekte && <Projekte />}
          {showDocs && <Docs />}
        </>
      </MenuDiv>
    </>
  )
}

export default AbbBarComponentBar
