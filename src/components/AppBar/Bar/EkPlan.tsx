import Button from '@mui/material/Button'
import { useLocation, Link } from 'react-router'

import styles from './EkPlan.module.css'

export const EkPlanMenus = () => {
  const { pathname, search } = useLocation()

  return [
    <Button
      key="artenBearbeiten"
      variant="text"
      component={Link}
      to={`/Daten/Projekte/017d3474-6b07-7c56-86ef-84b0af1de903${search}`}
      className={styles.artenButton}
    >
      Arten bearbeiten
    </Button>,
    <Button
      key="dokumentation"
      variant={pathname.startsWith('/Dokumentation') ? 'outlined' : 'text'}
      component={Link}
      to={`/Dokumentation/${search}`}
      className={styles.dokuButton}
    >
      Dokumentation
    </Button>,
  ]
}
