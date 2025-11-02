import { useLocation, Link } from 'react-router'
import Button from '@mui/material/Button'

import { button } from './Dokumentation.module.css'

const style = { marginRight: 8 }

export const Dokumentation = () => {
  const { pathname, search } = useLocation()
  const isDocs = pathname.startsWith('/Dokumentation')

  if (isDocs) return null

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
