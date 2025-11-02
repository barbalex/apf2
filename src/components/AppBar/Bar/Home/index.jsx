import Button from '@mui/material/Button'
import { useLocation, Link } from 'react-router'

import { Dokumentation } from './Dokumentation.jsx'
import { button } from './index.module.css'

export const HomeMenus = () => {
  const { search } = useLocation()

  return (
    <>
      <Button
        variant="text"
        component={Link}
        to={`/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13${search}`}
        className={button}
      >
        Daten
      </Button>
      <Dokumentation />
    </>
  )
}
