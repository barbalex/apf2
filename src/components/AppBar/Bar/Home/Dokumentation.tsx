import { useLocation } from 'react-router'
import Button from '@mui/material/Button'

import { PrefetchLink } from '../../../shared/PrefetchLink.tsx'

import styles from './Dokumentation.module.css'

export const Dokumentation = () => {
  const { search } = useLocation()

  return (
    <Button
      variant="text"
      component={PrefetchLink}
      to={`/Dokumentation/${search}`}
      className={styles.button}
    >
      Dokumentation
    </Button>
  )
}
