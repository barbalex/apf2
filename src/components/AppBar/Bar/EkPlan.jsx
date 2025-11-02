import Button from '@mui/material/Button'
import { useLocation, Link } from 'react-router'

import { artenButton, dokuButton } from './EkPlan.module.css'

export const EkPlanMenus = () => {
  const { pathname, search } = useLocation()

  return [
    <Button
      key="artenBearbeiten"
      variant="text"
      component={Link}
      to={`/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13${search}`}
      className={artenButton}
    >
      Arten bearbeiten
    </Button>,
    <Button
      key="dokumentation"
      variant={pathname.startsWith('/Dokumentation') ? 'outlined' : 'text'}
      component={Link}
      to={`/Dokumentation/${search}`}
      className={dokuButton}
    >
      Dokumentation
    </Button>,
  ]
}
