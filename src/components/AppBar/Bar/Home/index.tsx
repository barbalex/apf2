import Button from '@mui/material/Button'
import { useLocation } from 'react-router'

import { PrefetchLink } from '../../../shared/PrefetchLink.tsx'
import { Dokumentation } from './Dokumentation.tsx'
import styles from './index.module.css'

export const HomeMenus = () => {
  const { search } = useLocation()

  return (
    <>
      <Button
        variant="text"
        component={PrefetchLink}
        to={`/Daten/Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13${search}`}
        className={styles.button}
      >
        Daten
      </Button>
      <Dokumentation />
    </>
  )
}
