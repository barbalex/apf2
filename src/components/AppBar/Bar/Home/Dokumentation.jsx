import { useLocation, Link } from 'react-router'
import Button from '@mui/material/Button'

import { button } from './Dokumentation.module.css'

export const Dokumentation = () => {
  const { search } = useLocation()

  return (
    <Button
      variant="text"
      component={Link}
      to={`/Dokumentation/${search}`}
      className={button}
    >
      Dokumentation
    </Button>
  )
}
