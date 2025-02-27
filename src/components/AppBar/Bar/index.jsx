import { memo, useRef } from 'react'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import { useLocation, Link } from 'react-router'
import { useResizeDetector } from 'react-resize-detector'
import { useAtom } from 'jotai'

import { HomeMenus } from './Home/index.jsx'
import { EkPlanMenus } from './EkPlan.jsx'
import { ProjekteMenus } from './Projekte/index.jsx'
import { constants } from '../../../modules/constants.js'
import { isMobileViewAtom } from '../../../JotaiStore/index.js'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) =>
    props.alignflexend === 'true' ? 'flex-end' : 'space-between'};
  align-items: center;
  flex-grow: 1;
  overflow: hidden;
`
export const SiteTitle = styled(Button)`
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
  transform: ${(props) =>
    props.hide === 'true' ? 'translateX(-9999px)' : 'none'};
  // need to take hidden elements out of flow
  position: ${(props) => (props.hide === 'true' ? 'absolute' : 'unset')};

  :hover {
    border-width: 1px !important;
  }
`
export const MenuDiv = styled.div`
  display: flex;
  flex-wrap: nowrap;
  flex-grow: 1;
  justify-content: flex-end;
  overflow: hidden;
`

export const Bar = memo(() => {
  const { search, pathname } = useLocation()
  const showHome = pathname === '/' || pathname.startsWith('/Dokumentation')
  const showEkPlan = pathname.includes('/EK-Planung')

  const [isMobileView] = useAtom(isMobileViewAtom)

  const { width, ref } = useResizeDetector({
    handleHeight: false,
    refreshMode: 'debounce',
    refreshRate: 500,
    refreshOptions: { leading: false, trailing: true },
  })

  const menuDivRef = useRef(null)
  const menuDivWidth = menuDivRef.current?.offsetWidth ?? 0

  return (
    <Container
      ref={ref}
      alignflexend={(width < constants.minWidthToShowTitle).toString()}
    >
      <SiteTitle
        variant="outlined"
        component={Link}
        to={`/${search}`}
        title="Home"
        hide={(width <= constants.minWidthToShowTitle && !showHome).toString()}
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
})
