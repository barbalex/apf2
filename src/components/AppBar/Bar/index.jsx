import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import { useLocation, Link } from 'react-router-dom'
import { useResizeDetector } from 'react-resize-detector'

import { isMobilePhone } from '../../../modules/isMobilePhone.js'
import { HomeMenus } from './Home.jsx'
import { EkPlanMenus } from './EkPlan.jsx'
import { ProjekteMenus } from './Projekte/index.jsx'
import { DocsMenus } from './Docs.jsx'
import { minWidthToShowAllMenus, minWidthToShowTitle } from '../index.jsx'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) =>
    props.alignFlexEnd === 'true' ? 'flex-end' : 'space-between'};
  align-items: center;
  flex-grow: 1;
`
export const SiteTitle = styled(Button)`
  display: ${(props) => (props.hide === 'true' ? 'none' : 'block')} !important;
  flex-basis: 110px;
  flex-grow: 0;
  flex-shrink: 0;
  color: white !important;
  font-size: 1em !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  border-width: 0 !important;
  text-transform: none !important;
  white-space: nowrap !important;

  :hover {
    border-width: 1px !important;
  }
`
export const MenuDiv = styled.div`
  display: flex;
  flex-wrap: nowrap;
  flex-grow: 1;
  justify-content: flex-end;
`

export const Bar = () => {
  const isMobile = isMobilePhone()

  const { search, pathname } = useLocation()
  const showHome = pathname === '/'
  const showEkPlan = pathname.includes('/EK-Planung')
  // const showProjekte = pathname.startsWith('/Daten') && !showEkPlan
  const showDocs = pathname.startsWith('/Dokumentation')

  const { width, ref } = useResizeDetector({
    handleHeight: false,
    refreshMode: 'debounce',
    refreshRate: 500,
    refreshOptions: { leading: false, trailing: true },
  })

  const showAllMenus = !isMobile && width >= minWidthToShowAllMenus
  const showTitle = width >= minWidthToShowTitle
  const menuDivWidth = showTitle ? width - 110 : width

  return (
    <Container
      ref={ref}
      alignFlexEnd={(width < minWidthToShowTitle).toString()}
    >
      {showTitle && (
        <SiteTitle
          variant="outlined"
          component={Link}
          to={`/${search}`}
          title="Home"
          hide={(width <= minWidthToShowTitle).toString()}
        >
          AP Flora
        </SiteTitle>
      )}
      <MenuDiv width={menuDivWidth}>
        {showHome ?
          <HomeMenus />
        : showDocs ?
          <DocsMenus />
        : showEkPlan ?
          <EkPlanMenus />
        : <ProjekteMenus showAllMenus={showAllMenus} />}
      </MenuDiv>
    </Container>
  )
}
