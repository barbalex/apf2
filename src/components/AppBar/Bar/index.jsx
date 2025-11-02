import Button from '@mui/material/Button'
import { useLocation, Link } from 'react-router'
import { useAtom } from 'jotai'

import { HomeMenus } from './Home/index.jsx'
import { EkPlanMenus } from './EkPlan.jsx'
import { ProjekteMenus } from './Projekte/index.jsx'
import { isMobileViewAtom } from '../../../JotaiStore/index.js'

import { container, title, menu } from './index.module.css'

export const Bar = () => {
  const { search, pathname } = useLocation()
  const showHome = pathname === '/' || pathname.startsWith('/Dokumentation')
  const showEkPlan = pathname.includes('/EK-Planung')

  const [isMobileView] = useAtom(isMobileViewAtom)

  return (
    <div className={container}>
      <Button
        variant="outlined"
        component={Link}
        to={`/${search}`}
        title="Home"
        className={title}
      >
        AP Flora
      </Button>
      <div className={menu}>
        {showHome ?
          <HomeMenus />
        : showEkPlan ?
          <EkPlanMenus />
        : <ProjekteMenus />}
      </div>
    </div>
  )
}
