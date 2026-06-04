import Button from '@mui/material/Button'
import { useLocation, Link } from 'react-router'
import { useAtomValue } from 'jotai'

import { HomeMenus } from './Home/index.tsx'
import { EkPlanMenus } from './EkPlan.tsx'
import { ProjekteMenus } from './Projekte/index.tsx'
import { isMobileViewAtom } from '../../../store/index.ts'

import styles from './index.module.css'

export const Bar = () => {
  const { search, pathname } = useLocation()
  const showHome = pathname === '/' || pathname.startsWith('/Dokumentation')
  const showEkPlan = pathname.includes('/EK-Planung')

  const isMobileView = useAtomValue(isMobileViewAtom)

  return (
    <div className={styles.container}>
      <Button
        variant="outlined"
        component={Link}
        to={`/${search}`}
        title="Home"
        className={styles.title}
      >
        AP Flora
      </Button>
      <div className={styles.menu}>
        {showHome ?
          <HomeMenus />
        : showEkPlan ?
          <EkPlanMenus />
        : <ProjekteMenus />}
      </div>
    </div>
  )
}
